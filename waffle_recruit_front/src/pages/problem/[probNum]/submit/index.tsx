import React, { SyntheticEvent, useEffect, useState } from 'react';

import axios, { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, Input, Select, Tab, TextArea } from 'semantic-ui-react';

import styles from './Submit.module.css';

interface ISubmit {
  language: 'java' | 'kotlin' | 'javascript' | 'typescript' | 'python' | null;
  main_filename: string | null;
  files: {
    filename: string;
    code: string;
  }[];
}

const Submit: React.FC = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const {
    params: { prob_num },
  } = useRouteMatch<{ prob_num: string }>();

  const { values, resetForm, handleSubmit, setFieldValue } = useFormik<ISubmit>({
    initialValues: {
      language: null,
      main_filename: null,
      files: [
        {
          filename: '새 파일',
          code: '',
        },
      ],
    },
    onSubmit: (values) => {
      if (values.main_filename === null) {
        toast.error('메인 파일을 선택해 주세요.');
        return;
      } else if (values.language === null) {
        // CANNOT REACH HERE
        toast.error('언어를 선택해 주세요.');
        return;
      }
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
    AxiosResponse<{ remain: number } | { error: string }>,
    ISubmit,
    unknown
  >(
    (values) => {
      return axios.post(`/check/prob/${prob_num}/`, values);
    },
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          toast.success('정답입니다!');
        } else if (res.status === 202) {
          toast.info('이미 해결된 문제입니다.');
        }
        history.push(`/problem/${prob_num}`);
      },
      onError: (res) => {
        if (res.status === 400 && 'error' in res.data) {
          toast.error('오답입니다!');
        } else if (res.status === 402 && 'remain' in res.data) {
          const remain = res.data.remain;
          toast.info(remain + ' 초 뒤에 제출할 수 있습니다.');
        } else {
          toast.error('알 수 없는 오류가 발생했습니다. 오류가 지속되면 recruit@wafflestudio.com 으로 문의 부탁드립니다.');
          history.push('/problem/0');
        }
      },
    }
  );

  const handleDeleteFile = (index: number) => {
    if (values.files.length === 1) {
      toast.error('파일은 한 개 이상 있어야 합니다.');
      return;
    }

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
                  onChange={(e) => setFieldValue(`files[${i}].filename`, e.currentTarget.value)}
                />
                <Button color={'red'} type="button" onClick={() => handleDeleteFile(i)}>
                  삭제
                </Button>
              </div>
              <TextArea
                className={styles.code}
                key={i}
                value={item.code}
                placeholder={`#include <stdio.h>\n\nint main() {\n  printf("Hello World!");\n}`}
              />
            </Tab.Pane>
          );
        },
      };
    });

  const handleLanguageChange = (_: SyntheticEvent, data: unknown) => {
    const changeLanguage = () => {
      resetForm();
      setFieldValue('language', (data as { value: ISubmit['language'] }).value);
    };
    if (values.language) {
      const confirmed = window.confirm('언어가 변경되면 저장한 값들이 초기화됩니다. 정말 변경하시겠습니까?');
      if (confirmed) {
        changeLanguage();
      }
    } else {
      changeLanguage();
    }
  };

  const handleTabChange = (_: SyntheticEvent, data: unknown) => {
    const targetIndex = (data as { activeIndex: number } & unknown).activeIndex;
    if (targetIndex === values.files.length) {
      // 새 탭 추가
      setFieldValue('files', values.files.concat({ filename: '새 파일', code: '' }));
    }

    setSelectedTab(targetIndex);
  };

  return (
    <Form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.titleTrailing}>제출란</h2>

      <Select
        className={styles.radioWrapper}
        options={['java', 'python', 'typescript', 'javascript', 'kotlin'].map((item) => ({ key: item, value: item, text: item }))}
        placeholder={'언어를 선택하세요'}
        onChange={handleLanguageChange}
      />

      {values.language !== null && (
        <>
          <br />
          <Select
            className={styles.radioWrapper}
            options={values.files.map((item, i) => ({ key: i, value: i, text: item.filename }))}
            placeholder={'Main 파일을 선택하세요'}
            onChange={(_, data) => setFieldValue('main_filename', data.text)}
          />

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
  );
};

export default Submit;
