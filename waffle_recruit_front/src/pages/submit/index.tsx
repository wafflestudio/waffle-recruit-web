import React, { SyntheticEvent, useEffect, useState } from 'react';

import { AxiosError, AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import produce from 'immer';
import { useIsMutating, useMutation } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Confirm, Form, Input, Popup, Select, Tab, TextArea } from 'semantic-ui-react';
import styled from 'styled-components';

import { loadRecentSubmit, saveRecentSubmit } from '../../apis/localStorages';
import { authRequester, requester } from '../../apis/requester';

import styles from './Submit.module.css';

type LanguageType = 'java' | 'kotlin' | 'javascript' | 'c++' | 'python';

const allLanguages: LanguageType[] = ['java', 'kotlin', 'javascript', 'c++', 'python'];

interface FileType {
  filename: string;
  code: string;
}

interface SubmitType {
  language: LanguageType;
  files: FileType[];
}

const MyConfirm = styled(Confirm)`
  top: auto !important;
  left: auto !important;
  height: auto !important;
`;

const Warnings = styled.div`
  display: flex;
  justify-content: center;
  font-size: 18px;
  padding: 20px 40px 40px 40px;
  div {
    border-radius: 5px;
    border: 1px solid rgba(34, 36, 38, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  ul {
    width: auto;
    text-align: left;
    list-style: none;
    li {
      padding-top: 10px;
    }
  }
`;

const Submit: React.FC = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isRecentChangeConfirmOpen, setRecentChangeConfirmOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [language, setLanguage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    params: { prob_num },
  } = useRouteMatch<{ prob_num: string }>();

  useEffect(() => {
    if (!['0', '1', '2', '3'].includes(prob_num)) {
      toast.error('올바르지 않은 url입니다.');
      history.push('/problems/0');
      return;
    }
    setLanguage('');
    setFiles([]);
  }, [prob_num]);

  const submitAnswer = async (language: string, files: FileType[]) => {
    try {
      setIsSubmitting(true);
      const response: any = await authRequester.post(`/check/${prob_num}/submit/`, {
        req_data: {
          language: language,
          files: files,
        },
      });
      setTimeout(() => {
        setIsSubmitting(false);
      }, 10000);
      return Promise.resolve(response.data);
    } catch (e) {
      setIsSubmitting(false);
      return Promise.reject(e.response.data);
    }
  };

  const handleSubmitError = (error: any) => {
    if (error.hasOwnProperty('non_field_errors')) {
      toast.error(error.non_field_errors[0]);
    }
    if (error.hasOwnProperty('error')) {
      toast.error(error.error);
    }
    if (error.hasOwnProperty('remain')) {
      toast.error(`처리중입니다. ${error.remain}초 후에 다시 시도하세요`);
    }
    if (error.hasOwnProperty('detail')) {
      history.push('/signin');
    }
  };

  //
  // const submitAnswerMutation = useMutation<
  //   AxiosResponse<never>,
  //   AxiosError<{ remain: number } | { error: string; detail?: string }>,
  //   ISubmit,
  //   unknown
  // >(
  //   'submit',
  //   (values) => {
  //     return requester.post(`/check/${prob_num}/submit/`, values);
  //   },
  //   {
  //     onSuccess: () => {
  //       toast.info('채점이 시작되었습니다.');
  //       history.push(`/problem/${prob_num}`);
  //     },
  //     onError: (res) => {
  //       if (res.response?.data && 'error' in res.response.data) {
  //         toast.error(res.response?.data.error);
  //         history.push('/problems/0');
  //       } else if (res.response?.data && 'remain' in res.response.data) {
  //         const remain = res.response?.data.remain;
  //         toast.info(remain + ' 초 뒤에 제출할 수 있습니다.');
  //       } else {
  //         toast.error('알 수 없는 오류가 발생했습니다. 오류가 지속되면 recruit@wafflestudio.com 으로 문의 부탁드립니다.');
  //         history.push('/problems/0');
  //       }
  //     },
  //   }
  // );

  const handleFiles = (indexToChange: number, newFile: FileType) =>
    files.map((item, index) => (index === indexToChange ? newFile : item));

  const handleDeleteFile = (index: number) => {
    setFiles(files.splice(index, 1));
    if (selectedTab === files.length - 1) {
      setSelectedTab(selectedTab - 1);
    }
  };

  const panes: { menuItem: string; render: () => JSX.Element }[] = files.map((item, i) => {
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
                onChange={(e) => setFiles(handleFiles(i, { ...files[i], filename: e.currentTarget.value }))}
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
              onChange={(e) => {
                setFiles(handleFiles(i, { ...files[i], code: e.currentTarget.value }));
              }}
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

  const defaultFileByLanguage = (input: LanguageType) => {
    switch (input) {
      case 'java':
        return [{ filename: 'main.java', code: '' }];
      case 'python':
        return [{ filename: 'main.py', code: '' }];
      case 'javascript':
        return [{ filename: 'index.js', code: '' }];
      case 'c++':
        return [{ filename: 'main.cpp', code: '' }];
      case 'kotlin':
        return [{ filename: 'main.kt', code: '' }];
      case null:
        return [];
    }
  };

  const changeLanguage = (input: LanguageType) => {
    setLanguage(input);
    setFiles(defaultFileByLanguage(input));
  };

  const getRecentSubmit = () => {
    const data = loadRecentSubmit(prob_num);
    if (data) {
      const recentSubmit = JSON.parse(data) as SubmitType;
      setLanguage(recentSubmit.language);
      setFiles(recentSubmit.files);
    } else {
      toast.error('최근 제출한 파일이 없습니다');
    }
  };

  return (
    <>
      <Form
        onSubmit={() => {
          if (isSubmitting) {
            toast.error('10초에 한 번만 제출할 수 있습니다');
          } else {
            submitAnswer(language, files).then(
              (res) => {
                saveRecentSubmit(JSON.stringify({ language: language, files: files }), prob_num);
                toast.info(res.msg);
                history.push(`/problem/${prob_num}/`);
              },
              (e) => {
                handleSubmitError(e);
              }
            );
          }
        }}
      >
        <h2 className={styles.titleTrailing}>문제{prob_num} 제출란</h2>
        <Popup
          trigger={
            <Button basic tiny type={'button'} onClick={() => setRecentChangeConfirmOpen(true)}>
              마지막 제출 불러오기
            </Button>
          }
        >
          <Popup.Content>이 문제에 마지막으로 제출한 코드를 불러옵니다.</Popup.Content>
        </Popup>
        <Select
          className={styles.radioWrapper}
          options={allLanguages.map((item) => ({
            key: item,
            value: item,
            text: item,
          }))}
          placeholder={'언어를 선택하세요'}
          defaultValue={language}
          onChange={(e) => {
            if (
              e.currentTarget.textContent === 'java' ||
              e.currentTarget.textContent === 'kotlin' ||
              e.currentTarget.textContent === 'javascript' ||
              e.currentTarget.textContent === 'c++' ||
              e.currentTarget.textContent === 'python'
            ) {
              changeLanguage(e.currentTarget.textContent);
            }
          }}
        />

        {language !== '' && (
          <>
            <Tab
              activeIndex={selectedTab}
              onTabChange={(e) => {
                console.dir(e.currentTarget.tabIndex);
                console.dir(e.currentTarget);
              }}
              menu={{ fluid: true, vertical: true, tabular: true }}
              panes={panes}
            />

            <Button className={styles.titleTrailingClickable} type={'submit'}>
              제출
            </Button>
            <Warnings>
              <div>
                <b>주의사항</b>
              </div>
              <ul>
                <li>- 다음 표현은 사용 불가합니다: .exec(</li>
                <li>- java의 경우 public class Main이 아니라 public class main 으로 시작해야 합니다.</li>
              </ul>
            </Warnings>
          </>
        )}
      </Form>
      <MyConfirm
        open={isRecentChangeConfirmOpen}
        onConfirm={() => {
          getRecentSubmit();
          setRecentChangeConfirmOpen(false);
        }}
        onCancel={() => setRecentChangeConfirmOpen(false)}
        content={'마지막에 제출한 파일들을 불러옵니다.'}
      />
    </>
  );
};

export default Submit;
