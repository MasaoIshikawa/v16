import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Button } from 'components/Button';

import { parseUrlParams } from 'utils/parseUrlParams';

import style from './style.scss';

class Pending extends Component {
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
                <h2>APPLICATION PENDING</h2>
                <p className={cn('p-xlarge', style['bottomMargin-40'])}>You are pre-approved, but we need a bit more information before we can move forward. One of our credit specialists will review your application and contact you by phone and/or email within 24 hours regarding your application.</p>
                <Button
                  className="button large arrow green"
                  onClick={this.handleMerchantReturnClick}
                >
                  Merchant Return to Portal
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

Pending.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Pending.defaultProps = {
};

export default connect(state => ({
  auth: state.auth,
}))(Pending);
