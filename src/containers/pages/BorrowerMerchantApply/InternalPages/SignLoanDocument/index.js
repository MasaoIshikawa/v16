import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import Header from 'components/Header';
import Heading from 'components/Heading';
import Footer from 'components/Footer';

import {
  nextAction,
} from 'actions/workflow';

import thumbup from 'assets/icons/thumbs-up.svg';
import style from './style.scss';

class SignLoanDocument extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();
    this.props.history.push('/dashboard');
  }

  render() {
    const { className } = this.props;
    return (
      <form className={cn(style.App, className)} onSubmit={() => {}}>
        <Header />
        <section className={cn('grid-container fluid section', style['borrowers-message'])}>
          <div className="grid-container">
            <div className="grid-x grid-margin-x max-limited">
              {
                <div className="cell small-12 large-8 large-offset-2">
                  <img src={thumbup} alt="thumb" />
                  <Heading
                    heading="That's it. You're all set!"
                    subHeading="If you have any questions, please call us at (800) 994-6177"
                  />
                </div>
              }

            </div>
          </div>
        </section>
        <Footer />
      </form>
    );
  }
}

SignLoanDocument.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
};

SignLoanDocument.defaultProps = {
  className: '',
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(SignLoanDocument);
