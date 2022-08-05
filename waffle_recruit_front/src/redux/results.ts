import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ResultType {
  isSubmitted: boolean;
  content: { result: number; last_try: number; err_code: number; err_msg: string | null };
}

interface ResultsState {
  prob0: ResultType;
  prob1: ResultType;
  prob2: ResultType;
  prob3: ResultType;
}

interface ResultInputType {
  prob_num: string;
  response: { result: number; last_try: number; err_code: number; err_msg: string | null };
}

const noResult = { isSubmitted: false, content: { result: 0, last_try: 0, err_code: 0, err_msg: '' } };
const initialState = { prob0: noResult, prob1: noResult, prob2: noResult, prob3: noResult } as ResultsState;

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResults(state, action: PayloadAction<ResultInputType>) {
      const {
        prob_num,
        response: { result, last_try, err_code, err_msg },
      } = action.payload;
      switch (prob_num) {
        case '0':
          state.prob0 = { isSubmitted: true, content: { result, last_try, err_code, err_msg } };
          break;
        case '1':
          state.prob1 = { isSubmitted: true, content: { result, last_try, err_code, err_msg } };
          break;
        case '2':
          state.prob2 = { isSubmitted: true, content: { result, last_try, err_code, err_msg } };
          break;
        case '3':
          state.prob3 = { isSubmitted: true, content: { result, last_try, err_code, err_msg } };
          break;
        default:
          break;
      }
    },
    clearResult(state, action: PayloadAction<string>) {
      switch (action.payload) {
        case '0':
          state.prob0 = noResult;
          break;
        case '1':
          state.prob1 = noResult;
          break;
        case '2':
          state.prob2 = noResult;
          break;
        case '3':
          state.prob3 = noResult;
          break;
        default:
          break;
      }
    },
  },
});

export const { setResults, clearResult } = resultsSlice.actions;
export default resultsSlice.reducer;
