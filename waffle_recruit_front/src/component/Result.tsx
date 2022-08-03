import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import styled from 'styled-components';

import { authRequester } from '../apis/requester';

interface ResultParams {
  prob_num: string;
}

const ResultContainer = styled.div`
  background: lightgray;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
`;
interface ResultStateType {
  done: boolean;
  resultCorrect?: boolean;
  recentCorrect?: boolean;
}

const Result = ({ prob_num }: ResultParams) => {
  const [waiting, setWaiting] = useState<boolean>(false);
  const [resultState, setResultState] = useState<ResultStateType>({ done: false });
  const handleResult = async () => {
    try {
      setWaiting(true);
      const response = await authRequester.get(`/check/${prob_num}/result/`);
      return Promise.resolve(response.data);
    } catch (e) {
      return Promise.reject(e.response.data);
    } finally {
      setWaiting(false);
    }
  };

  useEffect(() => {
    handleResult().then(
      (response) => {
        const resultData: ResultStateType = {
          done: true,
          resultCorrect: response.result > 0,
          recentCorrect: response.recent > 0,
        };
        setResultState(resultData);
      },
      (error) => {
        if (error.hasOwnProperty('non_field_errors')) {
          setResultState({ done: false });
        }
      }
    );
  }, [prob_num]);

  return (
    <ResultContainer>
      <div>
        {waiting ? (
          '채점 중입니다...'
        ) : !resultState.done ? (
          '아직 풀지 않은 문제입니다'
        ) : (
          <>
            <p>전체 결과: {resultState.resultCorrect ? '정답입니다' : '오답입니다'}</p>
            <p>최근 결과: {resultState.recentCorrect ? '정답입니다' : '오답입니다'}</p>
          </>
        )}
      </div>
    </ResultContainer>
  );
};

export default Result;
