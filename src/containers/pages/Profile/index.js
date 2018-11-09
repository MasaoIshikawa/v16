import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Select from 'components/Form/Select';
import get from 'lodash/get';

import { getMerchantDetail } from 'actions/application';

import style from './style.scss';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: null,
    };
  }
  componentWillMount() {
    const merchantId = localStorage.getItem('merchantId');
    if (merchantId) {
      this.props.getMerchantDetail({
        url: `/merchants/${merchantId}`,
        success: (res) => {
          this.setState({
            pageData: res,
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
  }
  render() {
    // eslint-disable-next-line
    const { pageData } = this.state;
    return (
      <Fragment>
        <Header />
        <section className="container section">
          <div className="grid-container fluid portal page-profile-settings">

            <div className="grid-x">
              <div className="cell small-12 card-grid-container">

                <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                  <div className="cell small-12">
                    <h3>Profile Settings</h3>
                  </div>
                </div>

                <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                  <div className="cell small-12 large-6">

                    <div className="card card-editable">
                      <div className="card-header">
                        <h5>Personal Information</h5>
                        <button className="button green hide save-btn">Save Changes</button>
                      </div>

                      <div className="card-section">
                        <div className="grid-x grid-margin-x">
                          <div className="cell small-12 large-6">
                            <label className="has-value"><span>First Name</span>
                              <input type="text" value={get(pageData, 'contacts.0.firstName')} required />
                            </label>
                          </div>
                          <div className="cell small-12 large-6">
                            <label className="has-value"><span>Last Name</span>
                              <input type="text" value={get(pageData, 'contacts.0.lastName')} required />
                            </label>
                          </div>
                          <div className="cell small-12 large-6">
                            <label className="has-value"><span>Title</span>
                              <input type="text" value={get(pageData, 'contacts.0.title')} required />
                            </label>
                          </div>
                          <div className="cell small-12 large-6">
                            <label className="has-value"><span>Email</span>
                              <input type="text" value={get(pageData, 'contacts.0.email')} required />
                            </label>
                          </div>
                          <div className="cell small-12 large-6">
                            <label className="has-value"><span>Phone</span>
                              <input type="text" value={get(pageData, 'contacts.0.phoneNumber')} required />
                            </label>
                          </div>
                          <div className="cell small-12 large-6">
                            <label className="has-value"><span>Extension</span>
                              <input type="text" value={get(pageData, 'contacts.0.phoneExt')} />
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="card card-editable">
                      <div className="card-header">
                        <h5>Change Password</h5>
                        <button className="button green hide save-btn">Save Changes</button>
                      </div>
                      <div className="card-section">
                        <p>Approval and application status will be sent to:</p>
                        <div className="grid-x grid-margin-x">
                          <div className="cell small-12 large-6">
                            <label><span>New Password</span>
                              <input type="text" required />
                            </label>
                          </div>
                          <div className="cell small-12 large-6">
                            <label><span>Confirm Password</span>
                              <input type="text" required />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cell small-12 large-6">
                    <div className="card card-editable">
                      <div className="card-header">
                        <h5>Business Location</h5>
                        <button className="button green hide save-btn">Save Changes</button>
                      </div>
                      <div className="card-section">
                        <label className="has-value"><span>Street Address</span>
                          <input type="text" value={get(pageData, 'businessAddresses.0.address')} required />
                        </label>
                        {/* <label className="has-value"><span>Street Address 2</span>
                          <input type="text" value="Apt #727" required />
                        </label> */}
                        <div className={cn('grid-x grid-margin-x page-header', style.noBottom)}>
                          <div className="cell small-5">
                            <label className="has-value"><span>City</span>
                              <input type="text" value={get(pageData, 'businessAddresses.0.city')} required />
                            </label>
                          </div>
                          <div className="cell small-4">
                            <Select
                              name="state"
                              value={get(pageData, 'businessAddresses.0.state')}
                              data={[
                                { value: 'AL', title: 'Alabama' },
                                { value: 'AK', title: 'Alaska' },
                                { value: 'AZ', title: 'Arizona' },
                                { value: 'AR', title: 'Arkansas' },
                                { value: 'CA', title: 'California' },
                                { value: 'CO', title: 'Colorado' },
                                { value: 'DE', title: 'Delaware' },
                                { value: 'DC', title: 'District of Columbia' },
                                { value: 'FL', title: 'Florida' },
                                { value: 'GA', title: 'Georgia' },
                                { value: 'HI', title: 'Hawaii' },
                                { value: 'ID', title: 'Idaho' },
                                { value: 'IL', title: 'Illinois' },
                                { value: 'IN', title: 'Indiana' },
                                { value: 'IA', title: 'Iowa' },
                                { value: 'KY', title: 'Kentucky' },
                                { value: 'LA', title: 'Louisiana' },
                                { value: 'ME', title: 'Maine' },
                                { value: 'MD', title: 'Maryland' },
                                { value: 'MA', title: 'Massachusetts' },
                                { value: 'MI', title: 'Michigan' },
                                { value: 'MN', title: 'Minnesota' },
                                { value: 'MO', title: 'Missouri' },
                                { value: 'MT', title: 'Montana' },
                                { value: 'NE', title: 'Nebraska' },
                                { value: 'NV', title: 'Nevada' },
                                { value: 'NJ', title: 'New Jersey' },
                                { value: 'NM', title: 'New Mexico' },
                                { value: 'NC', title: 'North Carolina' },
                                { value: 'ND', title: 'North Dakota' },
                                { value: 'OH', title: 'Ohio' },
                                { value: 'OK', title: 'Oklahoma' },
                                { value: 'OR', title: 'Oregon' },
                                { value: 'PA', title: 'Pennsylvania' },
                                { value: 'RI', title: 'Rhode Island' },
                                { value: 'SD', title: 'South Dakota' },
                                { value: 'TN', title: 'Tennessee' },
                                { value: 'TX', title: 'Texas' },
                                { value: 'UT', title: 'Utah' },
                                { value: 'VA', title: 'Virginia' },
                              ]}
                              onChange={this.handleInputChange}
                              label="State"
                              isRequired
                            />
                          </div>
                          <div className="cell small-3">
                            <label className="has-value"><span>Zip Code</span>
                              <input type="text" value={get(pageData, 'businessAddresses.0.zipCode')} required />
                            </label>
                          </div>
                          <div className="cell small-12 checkbox-row padded-bottom">
                            <input id="ConfirmCheckbox" type="checkbox" />
                            <label htmlFor="ConfirmCheckbox">This is the primary account address</label>
                          </div>
                        </div>
                      </div>
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

Profile.propTypes = {
  getMerchantDetail: PropTypes.func.isRequired,
};

Profile.defaultProps = {

};

const mapStateToProps = state => ({
  applications: state.applications,
  navigation: state.navigation,
  fetch: state.fetch,
});

const mapDispatchToProps = dispatch => ({
  getMerchantDetail: data => dispatch(getMerchantDetail(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));
