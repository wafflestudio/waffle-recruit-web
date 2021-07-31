import React, { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import emoji from 'emoji-dictionary';
import toNumber from 'lodash/toNumber';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';

import Header from '../../../component/Sidebar';

import styles from './Problem.module.css';
import { problems } from './problems';

import '../../containers.css';

const ProblemPage: React.FC = () => {
  const history = useHistory();
  const {
    params: { prob_num },
  } = useRouteMatch<{ prob_num: string }>();

  const isSolvedQuery = useQuery<{ solved: boolean }>(`/check/prob/${prob_num}/`);
  const isSolved = isSolvedQuery.data?.solved;
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

  const problem = problems[toNumber(prob_num)];
  if (!problem) return null;
  const { title, content } = problem;
  const markdownInputStr = '> ````\n' + content + '\n````\n';
  const markdownSolverStatus = '#### *지금까지 총 ' + solvedCount + '명이 성공했습니다 :fire:*\n';

  return (
    <div>
      <Header />
      <Button onClick={() => history.push(`/problem/${prob_num}/submit`)}>제출하기</Button>
      <br />
      <br />
      <div className={styles.ReviewContainer}>
        <ReactMarkdown source={`# ${title} ${isSolved ? ':white_check_mark:' : ''}`} renderers={{ text: emojiSupport }} />
        <ReactMarkdown source={markdownInputStr} />
        <ReactMarkdown source={markdownSolverStatus} renderers={{ text: emojiSupport }} />
      </div>
    </div>
  );
};

export default ProblemPage;
