import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Button } from 'components/Button';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import circleDeclined from 'assets/icons/circle-declined.svg';

import style from './style.scss';

class Declined extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.nextAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        fail: (error) => {
          console.log(error);
        },
      });
    }
  }

  handleMerchantReturnClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.history.push('/dashboard/application-review');
    }
  }

  render() {
    return (
      <Fragment>
        <Header />
        <section className={cn('grid-container fluid section', style['borrowers-message'])}>
          <div className="grid-container">
            <div className="grid-x grid-margin-x max-limited">
              <div className="cell small-12 large-8 large-offset-2">
                <img src={circleDeclined} alt="Circle Declined" />
                <h2>Unfortunately, we were unable to approve your application at this time</h2>
                <p className="p-xlarge">You will receive an adverse action notice within 30 days that will provide you with the specific reason(s) as to why we were unable to approve your application.</p>
                {
                  localStorage.getItem('token') && (
                    <Button
                      className="button large arrow green"
                      onClick={this.handleMerchantReturnClick}
                    >
                      Merchant Return to Portal
                    </Button>
                  )
                }
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

Declined.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

Declined.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(Declined);
