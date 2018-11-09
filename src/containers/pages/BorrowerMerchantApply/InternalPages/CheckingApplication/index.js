import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Validator from 'components/Validator/Validator';
import ReactLoading from 'react-loading';

import { parseUrlParams } from 'utils/parseUrlParams';
import get from 'lodash/get';

import {
  checkinAction,
  checkPreviousAction,
} from 'actions/workflow';

import schema from './schema';
import style from './style.scss';

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      response: {},
    };
  }

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    if (!params.applicationId) {
      this.props.history.push('/');
    } else {
      this.props.checkPreviousAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/checkin`,
        // eslint-disable-next-line
        fail: (error) => {
          this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application?applicationId=${params.applicationId}`);
        },
      });
    }
  }

  render() {
    const { workflow } = this.props;
    const state = get(workflow, 'state');
    if (state) {
      const routeUrl = state.url;
      this.props.history.push(routeUrl);
    }
    return (
      <form>
        <Header />
        <div className={style.loading}><ReactLoading color="#04bc6c" width={100} height={100} /></div>
        <Footer />
      </form>
    );
  }
}

Application.propTypes = {
  history: PropTypes.object.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};

Application.defaultProps = {
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
      workflow: state.workflow,
    }),
    {
      checkinAction,
      checkPreviousAction,
    }
  )
)(Application);
