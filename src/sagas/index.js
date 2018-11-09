import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import borrowerApplySaga from './borrowerApplySaga';
import applicationSaga from './applicationSaga';
import workflowSaga from './workflowSaga';
import brochureSaga from './brochureSaga';
import bannerSaga from './bannerSaga';

export default function* () {
  yield all([
    authSaga(),
    borrowerApplySaga(),
    applicationSaga(),
    workflowSaga(),
    brochureSaga(),
    bannerSaga(),
  ]);
}
