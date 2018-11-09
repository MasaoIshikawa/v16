import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import circleDeclined from 'assets/icons/circle-declined.svg';

import style from './style.scss';

class Error extends Component {
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

  render() {
    const { location } = this.props;
    return (
      <Fragment>
        <Header />
        <section className={cn('grid-container fluid section', style['borrowers-message'])}>
          <div className="grid-container">
            <div className="grid-x grid-margin-x max-limited">
              <div className="cell small-12 large-8 large-offset-2">
                <img src={circleDeclined} alt="Circle Declined" />
                <h2>{location.state.message}</h2>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

Error.propTypes = {
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

Error.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(Error);
