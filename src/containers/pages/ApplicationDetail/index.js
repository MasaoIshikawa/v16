import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dateFNS from 'date-fns';
import get from 'lodash/get';
import filter from 'lodash/filter';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Button } from 'components/Button';
import Select from 'components/Form/Select';
import {
  getApplications,
  getApplicationFilters,
} from 'actions/application';
import { nextAction } from 'actions/workflow';

import { parseUrlParams } from 'utils/parseUrlParams';
import { states } from 'utils/states';
import style from './style.scss';

class ApplicationDetail extends Component {
  state = {
    isModalShown: false,
    isLoading: false,
    isSelectOfferVisible: false,
  }

  componentDidMount() {
    const params = parseUrlParams(window.location.search);
    this.props.getApplications({
      url: `/applications/${params.applicationId}`,
      success: (res) => {
        this.setState({
          response: res,
        });

        this.props.getApplicationFilters({
          url: 'filters/merchant-portal',
          success: (res1) => {
            this.setState({
              isSelectOfferVisible: !(get(filter(res1.filters, item => item.filterId === 'selectoffer'), '0.attributes.query.statusCode').indexOf(get(res, 'status.code')) === -1),
            });
          },
        });
      },
      fail: (err) => {
        // this.setState({ loading: false });

        if (err.response) {
          this.notificationSystem.addNotification({
            message: 'fetching user detail failes',
            level: 'error',
            position: 'tc',
          });
        } else {
          console.log('Error', err);
        }
      },
    });
  }

  handleCancelClick = (e) => {
    e.preventDefault();

    this.setState({
      isModalShown: true,
    });
  }

  handleCloseClick = (e) => {
    e.preventDefault();

    this.setState({
      isModalShown: false,
    });
  }

  handleSelectOffer = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.setState({ isLoading: true });
      this.props.nextAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/dtm/step/SelectOffer`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.setState({ isLoading: false });
        },
      });
    }
  }
  render() {
    const { isModalShown, response, isLoading, isSelectOfferVisible } = this.state;
    return (
      <Fragment>
        <Header />
        <section className="container">
          <div className="grid-container fluid portal page-application-details">

            <div className="grid-x">
              <div className="cell small-12 card-grid-container">

                <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                  <div className="cell small-12 large-4">
                    <h3>Application ID: {response && response.applicationId}</h3>
                  </div>
                  <div className="cell small-12 large-4">
                    <div className="loan-status">
                      <span>Status</span>
                      <span className={cn('badge needs-sig', style.activeStatus, style[`status-${get(response, 'status.code')}`])}>{get(response, 'status.aliases.merchantPortal')}</span>
                    </div>
                  </div>
                  <div className="cell small-12 large-4">
                    <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                      <div className="cell small-12 large-6">
                        {/* <Button
                          className={cn('button secondary w-100', style.button)}
                          data-toggle="LoanCancellation"
                          onClick={this.handleCancelClick}
                        >
                          Cancel Contract
                        </Button> */}
                      </div>
                      <div className="cell small-12 large-6">
                        {
                          isSelectOfferVisible &&
                            <Button
                              className="button green w-100"
                              onClick={this.handleSelectOffer}
                              isLoading={isLoading}
                            >
                              Select an Offer
                            </Button>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                  <div className="cell small-12 large-4">
                    <div className="card card-editable">
                      <div className="card-header">
                        <h5>Personal Information</h5>
                        <button className="button green hide save-btn">Save Changes</button>
                      </div>
                      <div className="card-section">
                        <label className="has-value"><span>First Name</span>
                          <input
                            type="text"
                            value={response && response.applicant.firstName}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <label className="has-value"><span>Last Name</span>
                          <input
                            type="text"
                            value={response && response.applicant.lastName}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <label className="has-value"><span>Middle Name</span>
                          <input
                            type="text"
                            value={response && response.applicant.middleName}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <label className="has-value"><span>Last 4 SSN</span>
                          <input
                            type="text"
                            value={response && `${response.applicant.ssn}`.slice(-4)}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <label className="has-value"><span>Date of Birth</span>
                          <input
                            type="text"
                            value={response && dateFNS.format(new Date(response.applicant.dateOfBirth), 'MM/DD/YYYY')}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="cell small-12 large-4">
                    <div className="card card-editable">
                      <div className="card-header">
                        <h5>Borrower Address</h5>
                        <button className="button green hide save-btn">Save Changes</button>
                      </div>
                      <div className="card-section">
                        <p>Address of the primary borrower</p>
                        <label className="has-value"><span>Street Address</span>
                          <input
                            type="text"
                            value={response && response.applicant.addresses[0].address}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <label className="has-value"><span>Street Address 2</span>
                          <input
                            type="text"
                            value={response && response.applicant.addresses[0].address}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <label className="has-value"><span>City</span>
                          <input
                            type="text"
                            value={response && response.applicant.addresses[0].city}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <div className="grid-x grid-margin-x page-header">
                          <div className="cell small-7">
                            <Select
                              name="applicant.addresses.state"
                              data={states}
                              value={(response && response.applicant.addresses[0].state) || 'WA'}
                              onChange={this.handleInputChange}
                              label="State"
                              isDisabled
                              isRequired
                              // hasError={!!errors['applicant.addresses.state']}
                            />
                          </div>
                          <div className="cell small-5">
                            <label className="has-value"><span>Zip Code</span>
                              <input
                                type="text"
                                value={response && response.applicant.addresses[0].zipCode}
                                onChange={this.handleInputChange}
                                readOnly
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cell small-12 large-4">
                    <div className="card card-editable">
                      <div className="card-header">
                        <h5>Contact Information</h5>
                        <button className="button green hide save-btn">Save Changes</button>
                      </div>
                      <div className="card-section">
                        <p>Approval and application status will be sent to:</p>
                        <label className="has-value"><span>Email Address</span>
                          <input
                            type="text"
                            value={response && response.applicant.email}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <label className="has-value"><span>Home Phone</span>
                          <input
                            type="text"
                            value={response && response.applicant.phoneNumbers[0].number}
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                        <label className="has-value"><span>Cell Phone</span>
                          <input
                            type="text"
                            value="(224) 250-3559"
                            onChange={this.handleInputChange}
                            readOnly
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>
        <Footer />
        <div className={cn('reveal-overlay', isModalShown && style.modal)}>
          <div className="reveal" id="LoanCancellation" data-reveal="" data-close-on-click="true" data-animation-in="slide-in-up" data-animation-out="slide-out-down" role="dialog" aria-hidden="false" data-yeti-box="LoanCancellation" data-resize="LoanCancellation" data-e="30lef0-e" tabIndex="-1" style={{ display: 'block' }}>
            <div className="card-header">
              <h5>Cancellation Reason</h5>
            </div>

            <div className="grid-x">
              <div className="cell small-12">
                <div className="form-group">
                  <div className="grid-x grid-margin-x">

                    <div className="cell small-12 medium-6">
                      <button className="button secondary toggle-btn w-100">Interest Rate</button>
                    </div>
                    <div className="cell small-12 medium-6">
                      <button className="button secondary toggle-btn w-100">Fees</button>
                    </div>
                    <div className="cell small-12 medium-6">
                      <button className="button secondary toggle-btn w-100">No longer making purchase</button>
                    </div>
                    <div className="cell small-12 medium-6">
                      <button className="button secondary toggle-btn w-100">Unable to Contact</button>
                    </div>
                    <div className="cell small-12 medium-6">
                      <button className="button secondary toggle-btn w-100">Monthly payment too high</button>
                    </div>
                    <div className="cell small-12 medium-6">
                      <button className="button secondary toggle-btn w-100">Wanted same as cash</button>
                    </div>
                    <div className="cell small-12 medium-6">
                      <button className="button secondary toggle-btn other-btn w-100">Other...</button>
                    </div>
                    <div id="OtherReason" className="cell small-12 hide">
                      <label><span>Enter Other Reason</span>
                        <input
                          type="text"
                          value=""
                          id="LoanSignature"
                          onChange={this.handleInputChange}
                          readOnly
                        />
                      </label>
                    </div>
                  </div>

                  <button id="FormSubmit2" className="button large arrow green w-100" disabled="">Cancel Contract</button>
                </div>
              </div>
            </div>

            <button className="close-button" onClick={this.handleCloseClick} data-close="" aria-label="Close reveal" type="button">
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

ApplicationDetail.propTypes = {
  history: PropTypes.object.isRequired,
  getApplications: PropTypes.func.isRequired,
  getApplicationFilters: PropTypes.func.isRequired,
  nextAction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  applications: state.applications,
  navigation: state.navigation,
  fetch: state.fetch,
});

export default connect(
  mapStateToProps,
  {
    getApplications,
    getApplicationFilters,
    nextAction,
  }
)(withRouter(ApplicationDetail));
