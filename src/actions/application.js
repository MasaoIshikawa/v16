import { ApplicationConstants } from 'constants/application';
import { createAction } from 'redux-actions';

export const getApplications = createAction(ApplicationConstants.FETCH_APPLICATION_LIST);
export const getOffers = createAction(ApplicationConstants.FETCH_OFFERS_LIST);
export const getApplicationFilters = createAction(ApplicationConstants.FETCH_APPLICATION_FILTERS);
export const getMerchantDetail = createAction(ApplicationConstants.FETCH_MERCHANT_DETAIL);
export const getStats = createAction(ApplicationConstants.GET_STATS);
export const getFeatures = createAction(ApplicationConstants.GET_FEATURES);
export const getFundingInformation = createAction(ApplicationConstants.GET_FUNDING_INFORMATION);
