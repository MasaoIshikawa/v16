export const appConfig = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://swat9g1qlg.execute-api.us-west-2.amazonaws.com/dev',
  userPoolId: process.env.REACT_APP_COGNITO_USERPOOL_ID || 'us-west-2_3B4G3iAcv',
  clientId: process.env.REACT_APP_COGNITO_CLIENT_ID || '7otihcc2id0ss3uirh3u6aaphs',
  region: process.env.REACT_APP_COGNITO_REGION || 'us-west-2',
  identityPoolId: process.env.REACT_APP_COGNITO_IDENTITYPOOL_ID || 'us-west-2:97b9ced9-fa08-4bc3-bb8d-7472e93803cc',
  limit: process.env.REACT_APP_GRID_PAGE_LIMIT || 10,
  smartyStreetAuthId: '976bb999-dcef-ae9b-0d5d-277754411d04',
  smartyStreetAuthToken: '32906422888838145',
  smartyStreetEnforce: true,
  env: process.env.NODE_ENV,
};
