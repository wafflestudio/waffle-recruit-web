import React, { SyntheticEvent, useEffect, useState } from 'react';

import { AxiosError, AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import produce from 'immer';
import { useIsMutating, useMutation } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Confirm, Form, Input, Popup, Select, Tab, TextArea } from 'semantic-ui-react';
import styled from 'styled-components';

import { requester } from '../../../../apis/requester';

import styles from './Submit.module.css';

interface ISubmit {
  language: 'java' | 'kotlin' | 'javascript' | 'typescript' | 'python' | null;
  files: {
    filename: string;
    code: string;
  }[];
}

const MyConfirm = styled(Confirm)`
  top: auto !important;
  left: auto !important;
  height: auto !important;
`;

const Submit: React.FC = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isRecentChangeConfirmOpen, setRecentChangeConfirmOpen] = useState<boolean>(false);

  const isSubmitting = !!useIsMutating({
    mutationKey: 'submit',
  });

  const {
    params: { prob_num },
  } = useRouteMatch<{ prob_num: string }>();

  const { values, resetForm, handleSubmit, setFieldValue } = useFormik<ISubmit>({
    initialValues: {
      language: null,
      files: [],
    },
    onSubmit: (values) => {
      if (values.language === null) {
        // CANNOT REACH HERE
        toast.error('언어를 선택해 주세요.');
        return;
      }
      if (isSubmitting) {
        toast.error('채점중입니다.');
        return;
      }

      localStorage.setItem('recentSubmit', JSON.stringify(values));
      submitAnswerMutation.mutate(values);
    },
  });

  useEffect(() => {
    if (!['0', '1', '2', '3'].includes(prob_num)) {
      toast.error('올바르지 않은 url입니다.');
      history.push('/problem/0');
      return;
    }
    resetForm();
  }, [prob_num]);

  const submitAnswerMutation = useMutation<
    AxiosResponse<never>,
    AxiosError<{ remain: number } | { error: string; detail?: string }>,
    ISubmit,
    unknown
  >(
    'submit',
    (values) => {
      return requester.post(`/check/prob/${prob_num}/`, values);
    },
    {
      onSuccess: () => {
        toast.info('채점이 시작되었습니다.');
        history.push(`/problem/${prob_num}`);
      },
      onError: (res) => {
        if (res.response?.data && 'error' in res.response.data) {
          toast.error(res.response?.data.error);
          history.push('/problem/0');
        } else if (res.response?.data && 'remain' in res.response.data) {
          const remain = res.response?.data.remain;
          toast.info(remain + ' 초 뒤에 제출할 수 있습니다.');
        } else {
          toast.error('알 수 없는 오류가 발생했습니다. 오류가 지속되면 recruit@wafflestudio.com 으로 문의 부탁드립니다.');
          history.push('/problem/0');
        }
      },
    }
  );

  const handleDeleteFile = (index: number) => {
    setFieldValue(
      'files',
      values.files.filter((_, i) => i !== index)
    );

    if (selectedTab === values.files.length - 1) {
      setSelectedTab(selectedTab - 1);
    }
  };

  const panes: { menuItem: string; render: () => JSX.Element }[] = values.files
    .concat({
      filename: '+ 추가',
      code: '',
    })
    .map((item, i) => {
      return {
        menuItem: item.filename,
        render: () => {
          return (
            <Tab.Pane>
              <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                  label={'파일명'}
                  value={item.filename}
                  readOnly={i === 0}
                  onChange={(e) => setFieldValue(`files[${i}].filename`, e.currentTarget.value)}
                  placeholder={'새 파일'}
                />
                {i !== 0 && (
                  <Button color={'red'} type="button" onClick={() => handleDeleteFile(i)}>
                    삭제
                  </Button>
                )}
              </div>
              <TextArea
                className={styles.code}
                key={i}
                value={item.code}
                onChange={(e) =>
                  setFieldValue(
                    'files',
                    produce(values.files, (draft) => {
                      draft[i].code = e.currentTarget.value;
                      return draft;
                    })
                  )
                }
                placeholder={
                  i === 0
                    ? `메인 파일입니다. 여기에 main 함수를 적어 주세요.\n\n#include <stdio.h>\n\nint main() {\n  printf("Hello World!");\n}`
                    : `#include <stdio.h>\n\nint main() {\n  printf("Hello World!");\n}`
                }
              />
            </Tab.Pane>
          );
        },
      };
    });

  const handleLanguageChange = (_: SyntheticEvent, data: unknown) => {
    const changeLanguage = () => {
      resetForm();
      const selectedLanguage = (data as { value: ISubmit['language'] }).value;
      setFieldValue('language', selectedLanguage);
      const defaultFiles: ISubmit['files'] = (() => {
        switch (selectedLanguage) {
          case 'java':
            return [{ filename: 'Main.java', code: '' }];
          case 'python':
            return [{ filename: 'main.py', code: '' }];
          case 'javascript':
            return [{ filename: 'index.js', code: '' }];
          case 'typescript':
            return [{ filename: 'index.ts', code: '' }];
          case 'kotlin':
            return [{ filename: 'main.kt', code: '' }];
          case null:
            return [];
        }
      })();
      setFieldValue('files', defaultFiles);
    };

    changeLanguage();
  };

  const handleTabChange = (_: SyntheticEvent, data: unknown) => {
    const targetIndex = (data as { activeIndex: number } & unknown).activeIndex;
    if (targetIndex === values.files.length) {
      // 새 탭 추가
      setFieldValue('files', values.files.concat({ filename: '', code: '' }));
    }

    setSelectedTab(targetIndex);
  };

  const reloadRecentSubmit = () => {
    const recentData = localStorage.getItem('recentSubmit');
    if (!recentData) {
      toast.error('최근에 이 브라우저에서 제출한 기록이 없습니다.');
      return;
    }

    const recentValues = JSON.parse(recentData) as ISubmit;
    setFieldValue('files', recentValues.files);
    setFieldValue('language', recentValues.language);
  };

  return (
    <>
      <Form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.titleTrailing}>제출란</h2>
        <Popup
          trigger={
            <Button basic tiny type={'button'} onClick={() => setRecentChangeConfirmOpen(true)}>
              마지막 제출 불러오기
            </Button>
          }
        >
          <Popup.Content>이 브라우저에서 진행한 마지막 제출을 불러옵니다.</Popup.Content>
        </Popup>
        <Select
          className={styles.radioWrapper}
          options={['java', 'python', 'typescript', 'javascript', 'kotlin'].map((item) => ({
            key: item,
            value: item,
            text: item,
          }))}
          placeholder={'언어를 선택하세요'}
          onChange={handleLanguageChange}
        />

        {values.language !== null && (
          <>
            <Tab
              activeIndex={selectedTab}
              onTabChange={handleTabChange}
              menu={{ fluid: true, vertical: true, tabular: true }}
              panes={panes}
            />

            <Button className={styles.titleTrailingClickable} type={'submit'}>
              제출
            </Button>
          </>
        )}
      </Form>
      <MyConfirm
        open={isRecentChangeConfirmOpen}
        onConfirm={() => {
          reloadRecentSubmit();
          setRecentChangeConfirmOpen(false);
        }}
        onCancel={() => setRecentChangeConfirmOpen(false)}
        content={'마지막에 제출한 파일들을 불러옵니다.'}
      />
    </>
  );
};

export default Submit;
