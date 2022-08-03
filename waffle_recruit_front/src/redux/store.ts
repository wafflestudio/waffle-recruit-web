import { configureStore } from '@reduxjs/toolkit';

import authStore from './auth';
import resultsStore from './results';
import sampleStore from './sample';

const store = configureStore({
  reducer: {
    sample: sampleStore,
    auth: authStore,
    results: resultsStore,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
