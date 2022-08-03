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
