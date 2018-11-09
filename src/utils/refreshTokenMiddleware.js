import { refreshToken } from './aws';
import { AuthConstants } from 'constants/auth';

// eslint-disable-next-line
export const refreshTokenMiddleware = ({ dispatch }) => next => async (action) => {
  if (action.type !== AuthConstants.AUTH_SIGN_OUT && localStorage.getItem('expiryTime') !== null) {
    const expiryTime = localStorage.getItem('expiryTime');

    if (expiryTime < Date.now()) {
      if (localStorage.getItem('isTokenRefreshing') === 'true') {
        const timer = setInterval(() => {
          if (localStorage.getItem('isTokenRefreshing') === 'false') {
            clearInterval(timer);
            return next(action);
          }
        }, 1000);
      } else {
        localStorage.setItem('isTokenRefreshing', 'true');
        await refreshToken();
        return next(action);
      }
    } else {
      return next(action);
    }
  } else {
    return next(action);
  }
};
