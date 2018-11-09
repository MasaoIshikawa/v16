import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Route,
  Redirect,
  Switch,
  withRouter,
} from 'react-router-dom';
import Login from './pages/Auth/Login';
import Forgot from './pages/Auth/Forgot';
import Merchant from './pages/MerchantApply/';
import Dashboard from './pages/Dashboard';
import ApplicationReview from './pages/ApplicationReview';
import ApplicationDetail from './pages/ApplicationDetail';
import TextApplyFrontend from './pages/TextApplyFrontend';
import Profile from './pages/Profile';
import FundingInformation from './pages/FundingInformation';
import RequestBrochures from './pages/RequestBrochures';
import WebBanners from './pages/WebBanners';
import Congrats from './pages/Congrats';

// Internal pages
import Application from './pages/BorrowerMerchantApply/InternalPages/Application';
import CheckingApplication from './pages/BorrowerMerchantApply/InternalPages/CheckingApplication';
import Congratulations from './pages/BorrowerMerchantApply/InternalPages/Congratulations';
import Declined from './pages/BorrowerMerchantApply/InternalPages/Declined';
import Pending from './pages/BorrowerMerchantApply/InternalPages/Pending';
import UgaDeclined from './pages/BorrowerMerchantApply/InternalPages/UgaDeclined';
import CreditAppDecision from './pages/BorrowerMerchantApply/InternalPages/CreditAppDecision';
import AutoPayElection from './pages/BorrowerMerchantApply/InternalPages/AutoPayElection';
import CreditOfferConfirmation from './pages/BorrowerMerchantApply/InternalPages/CreditOfferConfirmation';
import CreditAppDoc from './pages/BorrowerMerchantApply/InternalPages/CreditAppDoc';
import WorkflowComplete from './pages/BorrowerMerchantApply/InternalPages/WorkflowComplete';
import SignLoanDocument from './pages/BorrowerMerchantApply/InternalPages/SignLoanDocument';
import DirectSignLoanDocument from './pages/BorrowerMerchantApply/InternalPages/DirectSignLoanDocument';
import DocusignTimeout from './pages/BorrowerMerchantApply/InternalPages/DocusignTimeout';
import DocusignDeclined from './pages/BorrowerMerchantApply/InternalPages/DocusignDeclined';
import Error from './pages/BorrowerMerchantApply/InternalPages/Error';
import GeneralErrorPage from './pages/BorrowerMerchantApply/InternalPages/GeneralErrorPage';

const PrivateRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        const token = localStorage.getItem('idToken');
        return token ?
          <InternalComponent {...props} />
        :
          <Redirect
            to={{
              pathname: '/',
              // eslint-disable-next-line
              state: { from: props.location },
            }}
          />;
      }
    }
  />
);

const PublicRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        const token = localStorage.getItem('idToken');
        return !token ?
          <InternalComponent {...props} />
        :
          <Redirect
            to={{
              pathname: '/dashboard',
              // eslint-disable-next-line
              state: { from: props.location },
            }}
          />;
      }
    }
  />
);

const MultiRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={props => <InternalComponent {...props} />}
  />
);

const routes = [
  {
    name: 'Login',
    pathname: '/',
    component: Login,
    exact: true,
    wrapper: PublicRoute,
  },
  {
    name: 'Forgot',
    pathname: '/forgot',
    component: Forgot,
    exact: true,
    wrapper: PublicRoute,
  },
  {
    name: 'Application',
    pathname: '/applications/:workflowtype/application',
    component: Application,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Congratulations',
    pathname: '/applications/:workflowtype/congratulations',
    component: Congratulations,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Declined',
    pathname: '/applications/:workflowtype/declined',
    component: Declined,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Pending',
    pathname: '/applications/:workflowtype/pending',
    component: Pending,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'UGA Declined',
    pathname: '/applications/:workflowtype/uga-declined',
    component: UgaDeclined,
    exact: true,
    wrapper: MultiRoute,
  },
  // start Internal pages
  {
    name: 'Checking Application',
    pathname: '/applications/:workflowtype/checkin',
    component: CheckingApplication,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Credit Offer',
    pathname: '/applications/:workflowtype/creditoffer',
    component: CreditAppDecision,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Auto-Pay Election',
    pathname: '/applications/:workflowtype/autopayelection',
    component: AutoPayElection,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Credit Offer Confirmation',
    pathname: '/applications/:workflowtype/creditofferconfirmation',
    component: CreditOfferConfirmation,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Credit App Docusign',
    pathname: '/applications/:workflowtype/creditappdoc',
    component: CreditAppDoc,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Workflow Complete',
    pathname: '/applications/:workflowtype/complete',
    component: WorkflowComplete,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Sign Loan Document',
    pathname: '/applications/:workflowtype/step/:stepname',
    component: DirectSignLoanDocument,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Sign Loan Document',
    pathname: '/applications/:workflowtype/signloandocument',
    component: SignLoanDocument,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Signing document timed out',
    pathname: '/applications/:workflowtype/docusign/timeout',
    component: DocusignTimeout,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Docusign Declined',
    pathname: '/applications/:workflowtype/docusign/declined',
    component: DocusignDeclined,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'Error Page',
    pathname: '/applications/:workflowtype/error',
    component: Error,
    exact: true,
    wrapper: Route,
  },
  {
    name: 'General Error Page',
    pathname: '/applications/:workflowtype/general-error-page',
    component: GeneralErrorPage,
    exact: true,
    wrapper: Route,
  },
  // end Internal pages
  {
    name: 'Merchant',
    pathname: '/dashboard/merchants',
    component: Merchant,
    exact: true,
    wrapper: PrivateRoute,
  },
  {
    name: 'Application Review',
    pathname: '/dashboard/application-review/action/:statusCode/:searchQuery',
    component: ApplicationReview,
    wrapper: PrivateRoute,
  },
  {
    name: 'Application Review',
    pathname: '/dashboard/application-review/action/:statusCode',
    component: ApplicationReview,
    wrapper: PrivateRoute,
  },
  {
    name: 'Application Detail',
    pathname: '/dashboard/application-detail',
    component: ApplicationDetail,
    wrapper: PrivateRoute,
  },
  {
    name: 'Text Apply',
    pathname: '/dashboard/text-apply',
    component: TextApplyFrontend,
    wrapper: PrivateRoute,
  },
  {
    name: 'Profile Settings',
    pathname: '/dashboard/profile',
    component: Profile,
    wrapper: PrivateRoute,
  },
  {
    name: 'Funding Information',
    pathname: '/dashboard/funding-information',
    component: FundingInformation,
    wrapper: PrivateRoute,
  },
  {
    name: 'Request Brochures',
    pathname: '/dashboard/request-brochures',
    component: RequestBrochures,
    wrapper: PrivateRoute,
  },
  {
    name: 'Get Website Banners',
    pathname: '/dashboard/web-banners',
    component: WebBanners,
    wrapper: PrivateRoute,
  },
  {
    name: 'Congratulations',
    pathname: '/dashboard/congrats',
    component: Congrats,
    wrapper: PrivateRoute,
  },
  {
    name: 'Dashboard',
    pathname: '/dashboard',
    component: Dashboard,
    wrapper: PrivateRoute,
  },
];

export const ParentRoute = () => (
  <Switch>
    {routes.map((route, index) => (
      <route.wrapper
        component={route.component}
        key={index}
        path={route.pathname}
        exact={route.exact || false}
      />
    ))}
    <Redirect to="/" />
  </Switch>
);

PublicRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

MultiRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

export default compose(
  withRouter,
  connect(state => ({
    auth: state.auth,
  }))
)(ParentRoute);
