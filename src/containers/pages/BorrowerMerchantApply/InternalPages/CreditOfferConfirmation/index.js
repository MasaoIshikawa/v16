import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import get from 'lodash/get';

import Header from 'components/Header';
import Heading from 'components/Heading';
import Footer from 'components/Footer';
import FormGroup from 'components/Form/FormGroup';
import FormGroupLabel from 'components/FormGroupLabel';
import { Button } from 'components/Button';
import { Grid, Column } from 'components/Layout';

import { nextAction, sendContractToConsumer } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import { formatCurrency } from 'utils/formatCurrency';

import style from './style.scss';

class CreditOfferConfirmation extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
    isLoading: false,
    isSending: false,
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow } = this.props;
    if (get(workflow, 'state.data') === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    }
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  toggleModal = () => {
    this.setState(({ isModalShown }) => ({ isModalShown: !isModalShown }));
  }

  handleCheckboxChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.setState({
        isLoading: true,
      });

      this.props.nextAction({
        data: {
          returnURL: `${window.location.origin}/applications/${this.props.match.params.workflowtype}/complete?applicationId=${params.applicationId}`,
        },
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          this.setState({
            isLoading: false,
          });
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.setState({
            isLoading: false,
          });
        },
      });
    }
  }

  handleEmailContractToConsumer = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.setState({
        isSending: true,
      });

      this.props.sendContractToConsumer({
        url: `/applications/${params.applicationId}/applicant/email/contract`,
        // eslint-disable-next-line
        success: (response) => {
          this.setState({
            isSending: false,
          });
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.setState({
            isSending: false,
          });
        },
      });
    }
  }

  render() {
    const { workflow } = this.props;
    const { isLoading, isSending } = this.state;
    return (
      <Fragment>
        <Header />
        <section className="grid-container fluid borrowers-apply page-confirm section">
          <div className="grid-container">
            <div className="grid-x grid-margin-x max-limited">
              {
                <Fragment>
                  <Heading
                    heading="Offer Confirmation"
                    isCardVisible={false}
                    className="large-offset-1 large-10"
                  />
                  <div className="cell small-12 large-10 large-offset-1">
                    <FormGroup className="form-group">
                      <FormGroupLabel value="Confirm Amount of Sale" />
                      <div className="grid-x">
                        <div className={cn('card loan-card', style['loan-card'], style.active, style.selected)}>
                          <div className={cn('grid-x', style.promoMessage)}>
                            <div className={cn('cell small-6 medium-shrink', style.title)}>
                              <em>Special<br /> Offer</em>
                            </div>
                            <div className={cn('cell small-6 medium-auto', style.offer)}>
                              <p>Save<br /> up to</p>
                              <em>${formatCurrency(get(workflow, 'state.data.savingsSixMonthAmount'), 2) || '-'}</em>
                            </div>
                            <div className={cn('cell small-12 medium-shrink', style.detailDescription)}>
                              <p>WITH 6 MONTHS<br className="hide-for-small-only" /> PROMOTIONAL FINANCING**</p>
                            </div>
                          </div>
                          <Grid>
                            <div className={cn('cell small-12 medium-4 highlight', style.cell, style.highlight)}>
                              <h5>Estimated<br /> Monthly Payment</h5>
                              <h2>${formatCurrency(get(workflow, 'state.data.paymentAmount'), 2) || '-'}</h2>
                              <small className={style.small}>Offer #220190</small>
                            </div>
                            <div className={cn('cell small-12 medium-8', style.cell, style.detail)}>
                              <Grid>
                                <div className="cell small-6">
                                  <h5>Amount Financed</h5>
                                </div>
                                <div className="cell small-6">
                                  <h5><em>${formatCurrency(get(workflow, 'state.data.amountTaken'), 2) || '-'}</em></h5>
                                </div>
                              </Grid>
                              <Grid>
                                <div className="cell small-6">
                                  <h5>Loan Term</h5>
                                </div>
                                <div className="cell small-6">
                                  <h5><em>{get(workflow, 'state.data.term')} Months</em></h5>
                                </div>
                              </Grid>
                              <Grid>
                                <div className="cell small-6">
                                  <h5>Interest Rate</h5>
                                </div>
                                <div className="cell small-6">
                                  <h5><em>{formatCurrency(get(workflow, 'state.data.rate'), 2) || '-'}%</em></h5>
                                </div>
                              </Grid>
                              <Grid>
                                <div className="cell small-6">
                                  <h5>APR</h5>
                                </div>
                                <div className="cell small-6">
                                  <h5><em>{formatCurrency(get(workflow, 'state.data.apr'), 3) || '-'}%</em></h5>
                                </div>
                              </Grid>
                              <Grid>
                                <div className="cell small-6">
                                  <h5>Origination Fee*</h5>
                                </div>
                                <div className="cell small-6">
                                  <h5><em>{Number(formatCurrency(get(workflow, 'state.data.originationPercentage'), 2)) * 100 || '-'}%</em></h5>
                                </div>
                              </Grid>
                            </div>
                          </Grid>
                        </div>
                        <Column className="small-12 medium-12">
                          <Grid className="grid-x grid-margin-x">
                            <Column className="small-12 medium-12">
                              <Button
                                className={cn('button large green', style.button, style.buttonWidth)}
                                onClick={this.handleButtonClick}
                                isLoading={isLoading}
                              >
                                ESIGN NOW
                              </Button>
                            </Column>
                            <Column className="small-12 medium-12 flexViewHorizontal">
                              <Button
                                className={cn('button large green', style.button, style.buttonWidth)}
                                onClick={this.handleEmailContractToConsumer}
                                isLoading={isSending}
                              >
                                Email Contract to Consumer
                              </Button>
                            </Column>
                            <Column className={cn('small-12 medium-12', style.marginTop10)}>
                              <p className={style.description}>
                                Before your application can be finalized, LendingUSA and/or Cross River Bank will request a full credit report from on or more of the credit reporting agencies. This request will occur after you submit your completed application. This request will appear as a hard inquiry on your credit report and may affect your credit score.
                              </p>
                            </Column>
                            <Column className="small-12 medium-12">
                              <p className={style.description}>
                                * The Origination Fee is {Number(formatCurrency(get(workflow, 'state.data.originationPercentage'), 2)) * 100 || '-'}% of the Amount Financed, is non-refundable, and is considered earned upon the funding of your loan. You can calculate the dollar amount of the Origination Fee for each offer listed above by multiplying the Amount Financed figure for that offer by .0{Number(formatCurrency(get(workflow, 'state.data.originationPercentage'), 2)) * 100 || '-'}. For example, if the Amount Financed is $1,000 the corresponding Origination Fee would be ${Number(formatCurrency(get(workflow, 'state.data.originationPercentage'), 2)) * 100 || '-'}0($1000 x .0{Number(formatCurrency(get(workflow, 'state.data.originationPercentage'), 2)) * 100 || '-'} = ${Number(formatCurrency(get(workflow, 'state.data.originationPercentage'), 2)) * 100 || '-'}0). The total Principal Amount of your loan is the sum of the Amount Financed and the Origination Fee (i.e. if the Amount Financed is $1,000 the Principal Amount of the loan would be ${(1000 + (Number(formatCurrency(get(workflow, 'state.data.originationPercentage'), 2)) * 1000)) || '-'}). Please review your Loan Agreement for additional terms and conditions.
                              </p>
                            </Column>
                          </Grid>
                        </Column>
                      </div>
                    </FormGroup>
                  </div>
                </Fragment>
              }


            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

CreditOfferConfirmation.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  sendContractToConsumer: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};


export default connect(
  state => ({
    workflow: state.workflow,
    auth: state.auth,
  }),
  {
    nextAction,
    sendContractToConsumer,
  }
)(CreditOfferConfirmation);
