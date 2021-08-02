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

import Sidebar from '../../../component/Sidebar';

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
      <Sidebar />
      {/*<Button onClick={() => history.push(`/problem/${prob_num}/submit`)}>제출하기</Button>*/}
      <Button onClick={() => toast.info('오픈 예정입니다.')}>제출하기</Button>
      <br />
      <br />
      <div className={styles.ReviewContainer}>
        <div style={{ display: 'flex', height: 20, alignItems: 'center', gap: 8 }}>
          <ReactMarkdown source={`# ${title}`} renderers={{ text: emojiSupport }} />
          {isSolved ? (
            <span className="ui green label mini tag">해결 완료</span>
          ) : (
            <span className="ui red label mini tag">미해결</span>
          )}
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
      </div>
    </div>
  );
};

export default ProblemPage;
