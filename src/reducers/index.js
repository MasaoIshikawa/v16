import { combineReducers } from 'redux';
import { AuthConstants } from 'constants/auth';
import fetch from './fetch';
import applications from './applications';
import workflow from './workflow';
import global from './global';
import brochure from './brochure';
import banners from './banners';

const appReducer = combineReducers({
  applications,
  fetch,
  workflow,
  global,
  brochure,
  banners,
});

export default (state, action) => {
  const myState = action.type === AuthConstants.AUTH_SIGN_OUT ? undefined : state;
  return appReducer(myState, action);
};
