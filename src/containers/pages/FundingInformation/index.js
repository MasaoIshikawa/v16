import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';
import get from 'lodash/get';

import Header from 'components/Header';
import Footer from 'components/Footer';

import { getFundingInformation } from 'actions/application';

import style from './style.scss';

class FundingInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: null,
    };
  }
  componentWillMount() {
    const merchantId = localStorage.getItem('merchantId');
    if (merchantId) {
      this.props.getFundingInformation({
        url: `/bank-accounts/merchant/${merchantId}/primary`,
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
    const { pageData } = this.state;
    return (
      <Fragment>
        <Header />
        <section className="container section">
          <div className="grid-container fluid portal page-funding-info">

            <div className="grid-x">
              <div className="cell small-12 card-grid-container">

                <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                  <div className="cell small-12">
                    <h3>Funding Profile</h3>
                  </div>
                </div>

                <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                  <div className="cell small-12">

                    <div className="card card-editable">
                      <div className="card-header">
                        <h5>Bank Account Information</h5>
                        <button className="button green hide save-btn">Save Changes</button>
                      </div>

                      <div className="card-section">
                        <p>If you need to make any changes to your bank information, please contact us.</p>
                        <div className="grid-x grid-margin-x">
                          <div className="cell small-12 large-4">
                            <label className="has-value"><span>Account Holder Name</span>
                              <input type="text" value={get(pageData, 'accountHolderName')} disabled />
                            </label>
                          </div>
                          <div className="cell small-12 large-4">
                            <label className="has-value"><span>Bank Name</span>
                              <input type="text" value={get(pageData, 'bankName')} disabled />
                            </label>
                          </div>
                          <div className="cell small-12 large-4">
                            <label className="has-value"><span>Account Type</span>
                              <input type="text" value={get(pageData, 'accountType')} disabled />
                            </label>
                          </div>
                          <div className="cell small-12 large-4">
                            <label className="has-value"><span>Bank ABA Routing Number</span>
                              <input type="text" value={get(pageData, 'routingNumber')} disabled />
                            </label>
                          </div>
                          <div className="cell small-12 large-4">
                            <label className="has-value"><span>Bank Account Number</span>
                              <input type="text" value={get(pageData, 'accountNumber')} disabled />
                            </label>
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

FundingInformation.propTypes = {
  getFundingInformation: PropTypes.func.isRequired,
};

FundingInformation.defaultProps = {

};

const mapStateToProps = state => ({
  applications: state.applications,
  navigation: state.navigation,
  fetch: state.fetch,
});

const mapDispatchToProps = dispatch => ({
  getFundingInformation: data => dispatch(getFundingInformation(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FundingInformation));
