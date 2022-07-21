import React, { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import emoji from 'emoji-dictionary';
import toNumber from 'lodash/toNumber';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Icon, Loader, Popup } from 'semantic-ui-react';

import Sidebar from '../../../component/Sidebar';
import { MainPageWrapper, ReviewContainer } from '../../main';

import styles from './Problem.module.css';
import { problemStrings } from './problemStrings';

import '../../containers.css';

const ProblemPage: React.FC = () => {
  const history = useHistory();
  const {
    params: { prob_num },
  } = useRouteMatch<{ prob_num: string }>();

  const isSolvedQuery = useQuery<{
    solved: boolean;
    task:
      | {
          status: 'correct';
          message: 'correct' | 'already_correct';
        }
      | {
          status: 'pending';
          message: 'pending';
        }
      | {
          status: 'wrong';
          message: 'string';
        };
  }>(`/check/prob/${prob_num}/`);

  const solvedCountQuery = useQuery<{ number: number }>(`/check/solvers/${prob_num}/`);
  const solvedCount = solvedCountQuery.data ? solvedCountQuery.data.number : '-';

  useEffect(() => {
    if (!['0', '1', '2', '3'].includes(prob_num)) {
      toast.error('올바르지 않은 url입니다.');
      history.push('/problem/0');
      return;
    }
  }, [prob_num, history]);

  const emojiSupport = (text: any) => text.value.replace(/:\w+:/gi, (name: any) => emoji.getUnicode(name));

  const problem = problemStrings[toNumber(prob_num)];
  if (!problem) return null;
  const { title, content } = problem;
  const markdownInputStr = '> ````\n' + content + '\n````\n';
  const markdownSolverStatus = '#### *지금까지 총 ' + solvedCount + '명이 성공했습니다 :fire:*\n';

  return (
    <MainPageWrapper>
      <Sidebar />
      <ReviewContainer>
        <div style={{ display: 'flex', height: 20, alignItems: 'center', gap: 8, position: 'relative' }}>
          <ReactMarkdown source={`# ${title}`} renderers={{ text: emojiSupport }} />

          {isSolvedQuery.data?.task &&
            {
              correct: (
                <Popup trigger={<Icon name={'check circle'} color={'green'} />}>
                  <Popup.Header>마지막 제출 채점 결과</Popup.Header>
                  <Popup.Content>정답입니다!</Popup.Content>
                </Popup>
              ),
              pending: (
                <Popup
                  content={'제출하신 코드를 채점중입니다. 결과를 보려면 새로고침해 주세요.'}
                  trigger={<Loader inline active />}
                />
              ),
              wrong: (
                <Popup trigger={<Icon name={'exclamation circle'} color={'red'} />}>
                  <Popup.Header>마지막 제출 채점 결과</Popup.Header>
                  <Popup.Content>
                    오답입니다:
                    <br />
                    {isSolvedQuery.data.task.message}
                  </Popup.Content>
                </Popup>
              ),
            }[isSolvedQuery.data?.task.status]}
        </div>
        <ReactMarkdown source={markdownInputStr} />
        {prob_num === '3' && (
          <>
            <a href={'/skeleton/pr3_skel_java.tar'} download>
              Java 스켈레톤 다운로드
            </a>
            <br />
            <a href={'/skeleton/pr3_skel_py.tar'} download>
              Python 스켈레톤 다운로드
            </a>
          </>
        )}
        <ReactMarkdown source={markdownSolverStatus} renderers={{ text: emojiSupport }} />
        <Button onClick={() => history.push(`/problem/${prob_num}/submit`)}>제출하기</Button>
      </ReviewContainer>
    </MainPageWrapper>
  );
};

export default ProblemPage;
