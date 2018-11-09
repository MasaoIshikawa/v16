import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Button } from 'components/Button';
import { parseUrlParams } from 'utils/parseUrlParams';
import {
  nextAction,
} from 'actions/workflow';
import circleDeclined from 'assets/icons/circle-declined.svg';
import style from './style.scss';

class GeneralErrorPage extends Component {
  handleMerchantReturnClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.pid) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application/?pid=${params.pid}`);
    } else {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
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
                <p className="p-xlarge">Internal Server Error.</p>
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

GeneralErrorPage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

GeneralErrorPage.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(GeneralErrorPage);
