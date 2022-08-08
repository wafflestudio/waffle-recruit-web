import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
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
    transition: 0.5s;

    &.correct {
      color: #179435;
      background-color: white;
      border: 3px solid #179435;
    }

    &.incorrect {
      color: #db2828;
      background-color: white;
      border: 3px solid #db2828;
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

const lastTryErrorMsg = (code: number) => {
  if (code === 1) {
    return '런타임 에러';
  }
  if (code === 2) {
    return '컴파일 에러';
  }
  if (code === 3) {
    return '시간 초과';
  }
  if (code === 4) {
    return '잘못된 답입니다';
  }
  if (code === 5) {
    return '서버 에러: 문의 주시기 바랍니다';
  }
  return '';
};

const Result = ({ prob_num }: ResultParams) => {
  const dispatch = useDispatch();
  const [waiting, setWaiting] = useState<boolean>(false);
  const result = Object.values(useSelector((state: RootState) => state.results))[Number(prob_num)];

  const renderResult = () => {
    if (waiting)
      return (
        <div className="message">
          확인 중입니다 <Loader />
        </div>
      );
    if (result) {
      if (!result.isSubmitted) return <div className="message">아직 풀지 않은 문제입니다</div>;
      if (result.content.last_try === -1) {
        return (
          <div className="message">
            채점 중입니다 <Loader />
          </div>
        );
      }
      return (
        <div className={`message ${result.content.last_try === 1 ? 'correct' : 'incorrect'}`}>
          <p>최종 결과: {result.content.result === 1 ? '정답입니다' : '오답입니다'}</p>
          <p>
            최근 결과: {result.content.last_try === 1 ? '정답입니다' : '오답입니다. ' + lastTryErrorMsg(result.content.err_code)}
          </p>
        </div>
      );
    }
    return <div>문제 번호가 잘못되었습니다</div>;
  };
  const refreshResult = (isToast: boolean) => {
    setWaiting(true);
    checkResult(prob_num).then((res) => {
      if (res === 'no submit') {
        dispatch(clearResult(prob_num));
      } else if (res.last_try === -1) {
        setTimeout(() => {
          refreshResult(true);
        }, 5000);
      } else {
        if (res.err_msg && isToast) {
          toast.error(res.err_msg);
        }
        dispatch(setResults({ prob_num, response: res }));
      }
      setWaiting(false);
    });
    setWaiting(false);
  };

  useEffect(() => {
    refreshResult(false);
  }, [prob_num]);

  return <ResultContainer>{renderResult()}</ResultContainer>;
};

export default Result;
