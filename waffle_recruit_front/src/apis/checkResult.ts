import { ResultType } from '../redux/results';
import store from '../redux/store';

import { authRequester } from './requester';

export const checkResult = async (prob_num: string) => {
  try {
    const response = await authRequester(`/check/${prob_num}/result/`);
    return Promise.resolve(response.data);
  } catch (e) {
    if (e.response?.data?.non_field_errors === '제출하지 않은 문제입니다.') return Promise.resolve('no submit');
    return Promise.reject(e.response);
  }
};

const prob_nums = ['0', '1', '2', '3'];

export const getResult: (input: string) => ResultType | null | undefined = (input: string) => {
  if (!prob_nums.includes(input)) {
    return null;
  }
  if (input === '0') {
    return store.getState().results.prob0;
  }
  if (input === '1') {
    return store.getState().results.prob1;
  }
  if (input === '2') {
    return store.getState().results.prob2;
  }
  if (input === '3') {
    return store.getState().results.prob3;
  }
};
