import React, { useEffect, useState } from 'react';

import axios, { AxiosResponse } from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import emoji from 'emoji-dictionary';
import toNumber from 'lodash/toNumber';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Form, TextArea, Message } from 'semantic-ui-react';

import Header from '../../../component/Sidebar';

import '../../containers.css';
import './Problem.css';

const problems: { input: string; problem: string }[] = [
  { input: 'dummy1', problem: 'dummy1' },
  { input: 'dummy2', problem: 'dummy2' },
  { input: 'dummy3', problem: 'dummy3' },
];

const ProblemPage: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const history = useHistory();
  const {
    params: { prob_num },
  } = useRouteMatch<{ prob_num: string }>();

  const isSolvedQuery = useQuery<{ isSolved: boolean }>(`/check/prob/${prob_num}/`);
  const isSolved = isSolvedQuery.data?.isSolved;
  const solvedCountQuery = useQuery<{ number: number }>(`/check/solvers/${prob_num}/`);
  const solvedCount = solvedCountQuery.data?.number || '-';

  useEffect(() => {
    if (!['1', '2', '3'].includes(prob_num)) {
      history.push('/problem/1');
      return;
    }

    // clear
    setUserInput('');
  }, [prob_num]);

  const submitAnswerMutation = useMutation<AxiosResponse<never>, AxiosResponse<{ remain?: number }>>(
    () => {
      return axios.post(`/check/prob/${prob_num}/`, { answer: userInput });
    },
    {
      onSuccess: (res) => {
        if (res.status === 200) {
          alert('정답입니다!');
        }
      },
      onError: (res) => {
        if (res.status === 402) {
          const remain = res.data.remain;
          alert(remain + ' 초 뒤에 제출할 수 있습니다.');
        }
      },
    }
  );

  const emojiSupport = (text: any) => text.value.replace(/:\w+:/gi, (name: any) => emoji.getUnicode(name));

  const { input: problemInput, problem } = problems[toNumber(prob_num) - 1] || {};
  const markdownInputStr = '> ````\n' + problem + '\n````\n';
  const markdownSolverStatus = '#### *지금까지 총 ' + solvedCount + '명이 성공했습니다 :fire:*\n';

  if (!problem) return null;

  return (
    <div>
      <Header />
      <div className="ReviewContainer">
        <ReactMarkdown
          source={isSolved ? problem : problem.replace(':white_check_mark:', '')}
          renderers={{ text: emojiSupport }}
        />
        <h2 className="titleTrailing">당신을 위한 입력</h2>
        <CopyToClipboard text={problemInput}>
          <p className="titleTrailing-clickable">복사하기</p>
        </CopyToClipboard>

        <ReactMarkdown source={markdownInputStr} />
        <Form success={isSolved} error={isSolved === false} className="form">
          <h2 className="titleTrailing">제출란</h2>
          <p className="titleTrailing-clickable" onClick={() => submitAnswerMutation.mutate()}>
            제출하기
          </p>
          <TextArea
            placeholder="Answer"
            value={userInput}
            onChange={(data) => {
              setUserInput(data.currentTarget.value);
            }}
          />
          <Message success header="정답입니다!" content="" />
          <Message error header="정답이 아닙니다." content="" />
        </Form>
        <ReactMarkdown source={markdownSolverStatus} renderers={{ text: emojiSupport }} />
      </div>
    </div>
  );
};

export default ProblemPage;
