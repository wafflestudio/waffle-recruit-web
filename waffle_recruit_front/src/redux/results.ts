import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ResultType {
  isSubmitted: boolean;
  content: { result: boolean; last_try: boolean };
}

interface ResultsState {
  prob0: ResultType;
  prob1: ResultType;
  prob2: ResultType;
  prob3: ResultType;
}

interface ResultInputType {
  prob_num: string;
  response: { result: number; last_try: number };
}

const noResult = { isSubmitted: false, content: { result: false, last_try: false } };
const initialState = { prob0: noResult, prob1: noResult, prob2: noResult, prob3: noResult } as ResultsState;

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResults(state, action: PayloadAction<ResultInputType>) {
      const {
        prob_num,
        response: { result, last_try },
      } = action.payload;
      switch (prob_num) {
        case '0':
          state.prob0 = { isSubmitted: true, content: { result: result === 1, last_try: last_try === 1 } };
          break;
        case '1':
          state.prob1 = { isSubmitted: true, content: { result: result === 1, last_try: last_try === 1 } };
          break;
        case '2':
          state.prob2 = { isSubmitted: true, content: { result: result === 1, last_try: last_try === 1 } };
          break;
        case '3':
          state.prob3 = { isSubmitted: true, content: { result: result === 1, last_try: last_try === 1 } };
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
