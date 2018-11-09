import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ButtonLink } from 'components/Button';
import Input from 'components/Form/Input';
import cn from 'classnames';
import { get, findIndex } from 'lodash';
import Loading from 'react-loading-components';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Grid, Column } from 'components/Layout';

import {
  getStats,
  getFeatures,
} from 'actions/application';
import { formatCurrency } from 'utils/func';

import banners from 'assets/icons/banners.svg';
import brochures from 'assets/icons/brochures.svg';
import checklistBlue from 'assets/icons/checklist-blue.svg';
import textToApply from 'assets/icons/text-to-apply.svg';

import style from './style.scss';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      data: null,
      isLoading: true,
      features: null,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);

    this.getStats();
    this.getFeatures();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown, false);
  }

  getStats = () => {
    this.props.getStats({
      url: `/stats/merchant/${localStorage.getItem('merchantId')}/portal/lusa`,
      success: (res) => {
        this.setState({
          data: res,
          isLoading: false,
        });
      },
      fail: (res) => {
        console.log(res);
      },
    });
  }

  getFeatures = () => {
    this.props.getFeatures({
      url: `/merchants/${localStorage.getItem('merchantId')}/features`,
      success: (res) => {
        this.setState({
          features: res,
          isLoading: false,
        });
      },
      fail: (res) => {
        console.log(res);
      },
    });
  }

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
  }

  handleClickButton = (url, e) => {
    e.preventDefault();
    const { history } = this.props;
    history.push(url);
  }

  handleKeydown = (event) => {
    if (event.keyCode === 13) {
      this.props.history.push(`/dashboard/application-review/action/AllApplications/${this.state.searchQuery}`);
    }
  }

  handleChange = (e) => {
    e.preventDefault();

    this.setState({
      searchQuery: e.target.value,
    });
  }

  handleButtonClick = (type) => {
    switch (type) {
      case 'needSignatures':
        this.props.history.push('/dashboard/application-review/action/ContractSent');
        break;
      case 'approvalsDueToExpire':
        this.props.history.push('/dashboard/application-review/action/ApprovalsDueToExpire');
        break;
      case 'needInfo':
        this.props.history.push('/dashboard/application-review/action/InfoRequired');
        break;
      default:
        this.props.history.push('/dashboard/application-review/action/AllApprovals');
    }
  }

  render() {
    const { data, isLoading, features } = this.state;
    const t2aIndex = findIndex(features, item => item.code === 't2a');
    const isT2aEnabled = get(features, `${t2aIndex}.value`) === 'Enabled';
    return (
      <Fragment>
        <Header />
        <section className="grid-container fluid portal page-dashboard">
          <Grid>
            <Column id="StartBar" className="small-12 large-3">
              <Grid className="grid-margin-x">
                <Column id="StartHere" className="card small-12">
                  <h2>Start Here</h2>
                  <p className="p-large">To submit applications</p>
                  <ButtonLink
                    className="button arrow green"
                    onClick={this.handleClickButton.bind(null, '/applications/dtm/application')}
                  >
                    Apply Now
                  </ButtonLink>
                </Column>

                <Column className="small-12">
                  <Input
                    label="Check App Status"
                    name="appStatus"
                    placeHolder="Applicant Name"
                    value={this.state.searchQuery}
                    onChange={this.handleChange}
                  />
                </Column>
                <Column id="StartActions" className={cn('small-12', style.startActions)}>
                  <ButtonLink
                    className={cn(style['hover-highlight'], style.buttonLink)}
                    onClick={this.handleClickButton.bind(null, '/dashboard/application-review/action/AllApplications')}
                  >
                    <img src={checklistBlue} alt="Checklist Blue" />
                    <h5>Review Applications</h5>
                    <p className="p-small">View current and<br /> historical applications</p>
                  </ButtonLink>
                  {
                    isT2aEnabled &&
                    <ButtonLink
                      className={cn(style['hover-highlight'], style.buttonLink)}
                      onClick={this.handleClickButton.bind(null, '/dashboard/text-apply')}
                    >
                      <img src={textToApply} alt="text to apply" />
                      <h5><span className={cn('badge warning', style.badge)}>NEW</span>Text to Apply</h5>
                      <p className="p-small">Text the application link<br /> to your customer</p>
                    </ButtonLink>
                  }
                </Column>
              </Grid>
            </Column>
            <Column className="small-12 large-9 card-grid-container">
              <Grid className="grid-margin-x">
                <Column className="small-12 large-6">
                  <div id="ActionCenter" className="card">
                    <div className="card-header">
                      <h5>Action Center</h5>
                    </div>
                    <Grid className="card-grid">
                      <ButtonLink
                        className={cn(style['hover-highlight'], 'cell small-6')}
                        onClick={() => {}}
                      >
                        <h6>Need Signatures</h6>
                        <h2>
                          {
                            isLoading ?
                              <Loading type="oval" width={50} height={50} fill="#f44242" />
                              :
                              get(data, 'needSignatures') || 0
                          }
                        </h2>
                        <div className="button" onClick={this.handleButtonClick.bind(null, 'needSignatures')}>Take Action</div>
                      </ButtonLink>
                      <ButtonLink
                        className={cn(style['hover-highlight'], 'cell small-6')}
                        onClick={() => {}}
                      >
                        <h6>Approvals Due to Expire</h6>
                        <h2>
                          {
                            isLoading ?
                              <Loading type="oval" width={50} height={50} fill="#f44242" />
                              :
                              get(data, 'approvalsDueToExpire') || 0
                          }
                        </h2>
                        <div className="button" onClick={this.handleButtonClick.bind(null, 'approvalsDueToExpire')}>Take Action</div>
                      </ButtonLink>
                      <ButtonLink
                        className={cn(style['hover-highlight'], 'cell small-6')}
                        onClick={() => {}}
                      >
                        <h6>Need More Info</h6>
                        <h2>
                          {
                            isLoading ?
                              <Loading type="oval" width={50} height={50} fill="#f44242" />
                              :
                              get(data, 'needInfo') || 0
                          }
                        </h2>
                        <div className="button" onClick={this.handleButtonClick.bind(null, 'needInfo')}>Take Action</div>
                      </ButtonLink>
                      <ButtonLink
                        className={cn(style['hover-highlight'], 'cell small-6')}
                        onClick={() => {}}
                      >
                        <h6>Loan Approvals</h6>
                        <h2>
                          {
                            isLoading ?
                              <Loading type="oval" width={50} height={50} fill="#f44242" />
                              :
                              get(data, 'loanApprovals') || 0
                          }
                        </h2>
                        <div className="button green" onClick={this.handleButtonClick.bind(null, 'needFundingForm')}>View Now</div>
                      </ButtonLink>
                    </Grid>
                  </div>
                </Column>

                <Column className="small-12 large-6">

                  <div id="LoanStats" className="card">
                    <div className="card-header">
                      <h5>Loan Stats</h5>
                    </div>
                    <Grid className="card-grid">
                      <Column className="small-6">
                        <h6>Apps Submitted MTD</h6>
                        <h2>
                          {
                            isLoading ?
                              <Loading type="oval" width={50} height={50} fill="#f44242" />
                              :
                              get(data, 'appsSubmittedMTD') || 0
                          }
                        </h2>
                      </Column>
                      <Column className="small-6">
                        <h6>Apps Submitted YTD</h6>
                        <h2>
                          {
                            isLoading ?
                              <Loading type="oval" width={50} height={50} fill="#f44242" />
                              :
                              get(data, 'appsSubmittedYTD') || 0
                          }
                        </h2>
                      </Column>
                      <Column className="small-12">
                        <h6>Loans Approved</h6>
                        <h2>
                          {
                            isLoading ?
                              <Loading type="oval" width={50} height={50} fill="#f44242" />
                            :
                              `$${formatCurrency(get(data, 'loansApproved') || '0', 2)}`
                          }
                        </h2>
                      </Column>
                    </Grid>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h5>Merchant Resources</h5>
                    </div>
                    <ul className="card-list">
                      <li>
                        <ButtonLink
                          className={style['card-hover-highlight']}
                          onClick={this.handleClickButton.bind(null, '/dashboard/web-banners')}
                        >
                          <img src={banners} alt="Banners" />
                          Get Website Banners
                        </ButtonLink>
                      </li>
                      <li>
                        <ButtonLink
                          className={style['card-hover-highlight']}
                          onClick={this.handleClickButton.bind(null, '/dashboard/request-brochures')}
                        >
                          <img src={brochures} alt="Brochures" />
                          Request Physical Brochures
                        </ButtonLink>
                      </li>
                    </ul>
                  </div>

                </Column>
              </Grid>
            </Column>
          </Grid>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  getStats: PropTypes.func.isRequired,
  getFeatures: PropTypes.func.isRequired,
};

export default compose(
  withRouter,
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      getStats,
      getFeatures,
    }
  )
)(Dashboard);
