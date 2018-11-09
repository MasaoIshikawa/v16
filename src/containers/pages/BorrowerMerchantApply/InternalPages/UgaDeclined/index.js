import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
// import { Button } from 'components/Button';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import ugaImage from 'assets/images/uga-finance-logo.png';
import starImage from 'assets/icons/star-decline-partner.svg';

import style from './style.scss';

class UgaDeclined extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
  };

  componentWillMount() {
    // const params = parseUrlParams(window.location.search);
    // if (!params.applicationId) {
    //   this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    // }
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
        <section className="container">
          <div className={cn('grid-container fluid', style['borrowers-message'])}>
            <div className="grid-container">
              <div className="grid-x grid-margin-x max-limited">
                <div className="cell small-12 large-8 large-offset-2">
                  <div className={style['credit-score']}>
                    {/* <div class="score">613</div>
                    <span>Your Credit Score</span> */}
                  </div>
                  <h4>Unfortunately we are unable to approve you for a loan at this time due to your credit score.</h4>
                  <p>Our partner UGA Finance might be able to help. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
                  <h5><span>NEXT STEP:</span> Contact UGA Finance</h5>
                  <div className={style['green-arrows']} />
                </div>
              </div>
            </div>
          </div>
          <div className={cn('grid-container fluid', style.promo)}>
            <div className="grid-container">
              <div className="grid-x grid-margin-x max-limited">
                <div className="cell small-12 large-10 large-offset-1">

                  <div className={style['partner-logo']}>
                    <img src={ugaImage} width="160" alt="UGA Finance Logo" />
                  </div>
                  <p className="p-large">Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod.</p>
                  <h5>Call or click to continue</h5>

                  <div className={style['phone-cta']}>
                    <div className={style['d-flex']}>
                      <p>Call today for a FREE,<br />no-obligation credit consultation</p>
                      <a href="tel:18441234567">1-844-123-4567</a>
                    </div>
                  </div>
                  <div className={style.or}>OR</div>
                  <a target="_blank" rel="noopener noreferrer" href="https://fjfj" className="button secondary">Learn more about UGA Finance</a>

                  <div className={cn('grid-x grid-margin-x', style['partner-bullets'])}>
                    <div className="cell small-12 medium-4">
                      <img src={starImage} alt="" />
                      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod</p>
                    </div>
                    <div className="cell small-12 medium-4">
                      <img src={starImage} alt="" />
                      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod</p>
                    </div>
                    <div className="cell small-12 medium-4">
                      <img src={starImage} alt="" />
                      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

UgaDeclined.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

UgaDeclined.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(UgaDeclined);
