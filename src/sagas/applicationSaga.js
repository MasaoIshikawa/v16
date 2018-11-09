import { call, takeEvery } from 'redux-saga/effects';
import { ApplicationConstants } from 'constants/application';
import { request } from 'components/Fetch';

function* fetchApplicationList(action) {
  yield call(request({
    type: ApplicationConstants.FETCH_APPLICATION_LIST,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* fetchOffersList(action) {
  yield call(request({
    type: ApplicationConstants.FETCH_FETCH_LIST,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* fetchApplicationFilterList(action) {
  yield call(request({
    type: ApplicationConstants.FETCH_APPLICATION_FILTERS,
    method: 'GET',
    url: action.payload.url,
    payloadOnSuccess: data => ({
      filters: [
        ...data.filters[0].filters,
      ],
    }),
  }), action);
}

function* fetchMerchantDetail(action) {
  yield call(request({
    type: ApplicationConstants.FETCH_MERCHANT_DETAIL,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* getStats(action) {
  yield call(request({
    type: ApplicationConstants.GET_STATS,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* getFeatures(action) {
  yield call(request({
    type: ApplicationConstants.GET_FEATURES,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* getFundingInformation(action) {
  yield call(request({
    type: ApplicationConstants.GET_FUNDING_INFORMATION,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

export default function* () {
  yield takeEvery(ApplicationConstants.FETCH_APPLICATION_LIST, fetchApplicationList);
  yield takeEvery(ApplicationConstants.FETCH_OFFERS_LIST, fetchOffersList);
  yield takeEvery(ApplicationConstants.FETCH_APPLICATION_FILTERS, fetchApplicationFilterList);
  yield takeEvery(ApplicationConstants.FETCH_MERCHANT_DETAIL, fetchMerchantDetail);
  yield takeEvery(ApplicationConstants.GET_STATS, getStats);
  yield takeEvery(ApplicationConstants.GET_FEATURES, getFeatures);
  yield takeEvery(ApplicationConstants.GET_FUNDING_INFORMATION, getFundingInformation);
}
