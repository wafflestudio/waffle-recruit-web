import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { checkResult, getResult } from '../apis/checkResult';
import { authRequester } from '../apis/requester';
import { clearResult, setResults } from '../redux/results';
import { RootState } from '../redux/store';

interface ResultParams {
  prob_num: string;
}

const ResultContainer = styled.div`
  .message {
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 5px;
    background: lightgray;
    margin-bottom: 15px;

    &.correct {
      color: white;
      background-color: #1dbe44;
      font-weight: bold;
    }

    &.incorrect {
      color: white;
      background-color: #db2828;
      font-weight: bold;
    }
  }
`;

const spin = keyframes`
  100%  { 
    transform: rotate(360deg); 
  }
`;

const Loader = styled.div`
  display: inline-block;
  position: relative;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: lightgray;
  border: 2px solid gray;
  margin-left: 3px;
  right: 0;
  border-top: 2px solid lightgray;
  animation: ${spin} 800ms infinite linear;
`;

const Result = ({ prob_num }: ResultParams) => {
  const dispatch = useDispatch();
  const [waiting, setWaiting] = useState<boolean>(false);
  const result = Object.values(useSelector((state: RootState) => state.results))[Number(prob_num)];
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
  const renderResult = () => {
    if (waiting)
      return (
        <div className="message">
          확인 중입니다 <Loader />
        </div>
      );
    if (result) {
      if (!result.isSubmitted) return <div className="message">아직 풀지 않은 문제입니다</div>;
      if (result.content.last_try === -1)
        return (
          <div className="message">
            채점 중입니다 <Loader />
          </div>
        );
      return (
        <div className={`message ${result.content.result === 1 ? 'correct' : 'incorrect'}`}>
          <p>최종 결과: {result.content.result === 1 ? '정답입니다' : '오답입니다'}</p>
          <p>최근 결과: {result.content.last_try === 1 ? '정답입니다' : '오답입니다'}</p>
        </div>
      );
    }
    return <div>문제 번호가 잘못되었습니다</div>;
  };
  const refreshResult = () => {
    setWaiting(true);
    checkResult(prob_num).then((res) => {
      if (res === 'no submit') {
        dispatch(clearResult(prob_num));
      } else if (res.last_try === -1) {
        setTimeout(() => {
          refreshResult();
        }, 5000);
      } else {
        dispatch(setResults({ prob_num, response: res }));
      }
      setWaiting(false);
    });
    setWaiting(false);
  };

  useEffect(() => {
    refreshResult();
  }, [prob_num]);

  return <ResultContainer>{renderResult()}</ResultContainer>;
};

export default Result;
