import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';

import Datetime from 'react-datetime';
import Header from 'components/Header';
import Heading from 'components/Heading';
import Footer from 'components/Footer';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Form/Input';
import FormGroupLabel from 'components/FormGroupLabel';
import { Button } from 'components/Button';
import Modal from 'components/Modal/AnimatedModal';
import Checkbox from 'components/Form/Checkbox';
import { Grid, Column } from 'components/Layout';

import { parseUrlParams } from 'utils/parseUrlParams';
import { currencyMask, unmask, floatUnmask, confirmAmountOfSaleMask } from 'utils/masks';
import { formatCurrency } from 'utils/formatCurrency';

import {
  nextAction,
  updateOffer,
  checkPreviousAction,
} from 'actions/workflow';

import style from './style.scss';

class CreditAppDecision extends Component {
  state = {
    // eslint-disable-next-line
    response: {
      offers: null,
    },
    isModalShown: false,
    isChecked1: false,
    isChecked2: false,
    isChecked1Error: '',
    isChecked2Error: '',
    selectedIndex: -1,
    isLoading: false,
    purchaseDate: '',
    purchaseDateError: '',
    signature: '',
    signatureError: '',
    confirmAmountOfSale: '',
    confirmAmountOfSaleError: '',
    isUpdating: false,
    isUpdated: false,
  }

  componentWillMount() {
    const params = parseUrlParams(window.location.search);

    const { history, workflow } = this.props;
    if (get(workflow, 'state.data') === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    } else {
      const selectedIndex = findIndex(get(workflow, 'state.data.offers'), item => item.selected);
      this.setState({
        confirmAmountOfSale: formatCurrency(get(workflow, 'state.data.approvalAmount') || 0, 2),
        selectedIndex,
      });
    }
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.workflow, this.props.workflow)) {
      const selectedIndex = findIndex(get(nextProps.workflow, 'state.data.offers'), item => item.selected);
      this.setState({
        confirmAmountOfSale: formatCurrency(get(nextProps.workflow, 'state.data.approvalAmount') || 0, 2),
        selectedIndex,
      });
    }
  }

  toggleModal = () => {
    this.setState(({ isModalShown }) => ({ isModalShown: !isModalShown }));
  }

  handleCheckboxChange = (name, value) => {
    this.setState({
      [name]: value,
      [`${name}Error`]: '',
    });
  }

  handleFinalizeSale = (e) => {
    e.preventDefault();
    const { workflow } = this.props;
    const response = get(workflow, 'state.data');

    const { purchaseDate, isChecked1, isChecked2, signature, confirmAmountOfSale } = this.state;
    const params = parseUrlParams(window.location.search);

    if (!purchaseDate) {
      this.setState({
        purchaseDateError: 'This field is required!',
      });
    }
    if (!signature) {
      this.setState({
        signatureError: 'This field is required!',
      });
    }
    if (!isChecked1) {
      this.setState({
        isChecked1Error: 'This field is required!',
      });
    }
    if (!isChecked2) {
      this.setState({
        isChecked2Error: 'This field is required!',
      });
    }
    if (Number(confirmAmountOfSale) < 1000 || Number(confirmAmountOfSale) > confirmAmountOfSale) {
      this.setState({
        confirmAmountOfSaleError: 'Confirm Amount of Sale must be between $1,000 and $35,000',
      });
    } else if (!!params.applicationId && purchaseDate && isChecked1 && isChecked2 && !!signature) {
      this.setState({ isLoading: true });
      this.props.nextAction({
        data: {
          subEntityId: response.subEntityId,
          subEntityType: response.subEntityType,
          Term: response.offers[this.state.selectedIndex].term,
          ServiceDate: this.state.purchaseDate,
          AmountTaken: response.offers[this.state.selectedIndex].amountTaken,
        },
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (res) => {
          this.setState({ isLoading: false });
          const routeUrl = res.state && res.state.url;
          this.props.history.push(routeUrl);
        },
        fail: (error) => {
          console.log(error);
        },
      });
    }
  }
  // eslint-disable-next-line
  selectOffer = (selectedIndex, e) => {
    e.preventDefault();
    const { workflow } = this.props;
    const response = get(workflow, 'state.data');
    response.offers && response.offers.forEach((item, index) => {
      if (index === selectedIndex) {
        this.setState((prevState) => {
          const updatedOffers = prevState.response.offers.map(offer => ({
            ...offer,
            selected: false,
          }));
          updatedOffers[selectedIndex] = {
            ...updatedOffers[selectedIndex],
            selected: !updatedOffers[selectedIndex].selected,
          };
          return {
            response: {
              ...prevState.response,
              offers: updatedOffers,
            },
            selectedIndex,
          };
        });
      }
    });
    this.setState({
      isModalShown: true,
    });
  }

  handleSelect = (selectedIndex, e) => {
    e.preventDefault();
    this.setState({
      selectedIndex,
    });
  }

  handleDisplayModal = (e) => {
    e.preventDefault();

    this.setState({
      isModalShown: true,
    });
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      signature: e.target.value,
      signatureError: '',
    });
  }

  handleProductTotalChange = (e) => {
    e.preventDefault();

    this.setState({
      confirmAmountOfSale: e.target.value,
    });
  }

  handleDateChange = (date) => {
    this.setState({
      purchaseDate: date,
      purchaseDateError: '',
    });
  }

  handleClickUpdate = (e) => {
    e.preventDefault();
    const { history } = this.props;
    const params = parseUrlParams(window.location.search);

    if (Number.parseFloat(floatUnmask(this.state.confirmAmountOfSale)) < 1000 || Number.parseFloat(floatUnmask(this.state.confirmAmountOfSale)) > 35000) {
      this.setState({
        errorMessage: 'Confirm Amount of Sale must be between $1,000.00 and $35,000.00',
      });
      return false;
    }

    this.setState({
      isUpdating: true,
      errorMessage: '',
    });
    this.props.updateOffer({
      data: {
        SequenceId: 'SQTU01',
        RequestedAmount: unmask(`${this.state.confirmAmountOfSale}`),
      },
      url: `/workflows/application/${params.applicationId}/workflow/pricing/checkin`,
      // eslint-disable-next-line
      success: (res) => {
        this.props.checkPreviousAction({
          data: {},
          url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/checkin`,
          // eslint-disable-next-line
          success: (response) => {
            this.setState({
              isUpdating: false,
              isUpdated: true,
              errorMessage: '',
            });
            history.push(get(response, 'state.url'));
          },
          // eslint-disable-next-line
          fail: (error) => {
            this.props.history.replace(`/applications/${this.props.match.params.workflowtype}/application?applicationId=${params.applicationId}`);
          },
        });
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }

  handleBlur = (e) => {
    e.preventDefault();
    this.setState({
      confirmAmountOfSale: e.target.value ? formatCurrency(floatUnmask(e.target.value), 2) : '',
    });
  }

  render() {
    const { className, workflow } = this.props;
    const {
      isModalShown,
      selectedIndex,
      isLoading,
      purchaseDate,
      purchaseDateError,
      signature,
      signatureError,
      confirmAmountOfSale,
      confirmAmountOfSaleError,
      isChecked1,
      isChecked1Error,
      isChecked2,
      isChecked2Error,
      isUpdating,
      isUpdated,
      errorMessage,
    } = this.state;
    const response = get(workflow, 'state.data');
    return (
      response ?
        <Fragment>
          <Header />
          <section className="grid-container fluid borrowers-apply section">
            <div className="grid-container">
              <div className="grid-x grid-margin-x max-limited">
                {
                  <Fragment>
                    <Heading
                      heading="Select Loan Offer"
                      isCardVisible={false}
                      className="large-offset-1 large-10"
                    />
                    <div className="cell small-12 large-10 large-offset-1">
                      <FormGroup className="form-group">
                        <FormGroupLabel value="Confirm Amount of Sale" />
                        <Grid className="grid-margin-x">
                          <Column className="small-12 medium-5">
                            <Input
                              name="serviceOfProductTotal"
                              label="Pre-Approval Amount"
                              value={`${formatCurrency((response && response.approvalAmount) || 0, 2)}`}
                              isBadgeVisible={false}
                              isMasked={currencyMask}
                              readOnly
                            />
                          </Column>
                          <Column className="small-12 medium-5">
                            <Input
                              name="serviceOfProductTotal"
                              label="Confirm Amount of Sale"
                              onChange={this.handleProductTotalChange}
                              value={`${confirmAmountOfSale || ''}`}
                              isRequired
                              isMasked={confirmAmountOfSaleMask}
                              notification="Changing the total will update the estimated monthly payment"
                              isBadgeVisible={false}
                              placeHolder="$1,000.00 minimum"
                              onBlur={this.handleBlur}
                              hasError={!!errorMessage}
                              errorMessage={errorMessage}
                            />
                          </Column>
                          <Column className="small-12 medium-2">
                            <Button
                              className={cn('button green w-100', style.button)}
                              isDisabled={!confirmAmountOfSale}
                              onClick={this.handleClickUpdate}
                              isLoading={isUpdating}
                            >
                              Update
                            </Button>
                          </Column>
                          {
                            isUpdated &&
                              <Column className="small-12 medium-12">
                                <h3 className={style['counter-offer-text']}>Congratulations, you&apos;ve been approved for the maximum amount of ${confirmAmountOfSale}</h3>
                              </Column>
                          }
                        </Grid>
                      </FormGroup>
                      <FormGroup className="form-group">
                        <FormGroupLabel value="Select an offer and confirm amount" />
                        <div className="grid-x">
                          {// eslint-disable-next-line
                            response.offers && response.offers.map((item, key) => (
                              <div
                                key={key}
                                className={cn('card loan-card', style['loan-card'], style.active, key === selectedIndex && style.selected)}
                                onClick={this.handleSelect.bind(null, key)}
                              >
                                <div className={cn('grid-x', style.promoMessage)}>
                                  <div className={cn('cell small-6 medium-shrink', style.title)}>
                                    <em>Special<br /> Offer</em>
                                  </div>
                                  <div className={cn('cell small-6 medium-auto', style.offer)}>
                                    <p>Save<br /> up to</p>
                                    <em>${formatCurrency(item.savingsSixMonthAmount, 2) || '-'}</em>
                                  </div>
                                  <div className={cn('cell small-12 medium-shrink', style.detailDescription)}>
                                    <p>WITH 6 MONTHS<br className="hide-for-small-only" /> PROMOTIONAL FINANCING**</p>
                                  </div>
                                </div>
                                <div className="grid-x">
                                  <div className={cn('cell small-12 medium-4 highlight', style.cell, style.highlight)}>
                                    <h5>Estimated<br /> Monthly Payment</h5>
                                    <h2>${formatCurrency(item.paymentAmount, 2) || '-'}</h2>
                                    {
                                      key === selectedIndex ?
                                        <Button
                                          className={cn('button secondary w-100 btn-select-toggle green', style.selectButton)}
                                        >
                                          Selected
                                        </Button>
                                      :
                                        <Button
                                          className={cn('button secondary w-100 btn-select-toggle green', style.selectButton)}
                                        >
                                          Select
                                        </Button>
                                    }
                                  </div>
                                  <div className={cn('cell small-12 medium-8', style.cell, style.detail)}>
                                    <div className="grid-x">
                                      <div className="cell small-6">
                                        <h5>Amount Financed</h5>
                                      </div>
                                      <div className="cell small-6">
                                        <h5><em>${formatCurrency(response.approvalAmount, 2) || '-'}</em></h5>
                                      </div>
                                    </div>
                                    <div className="grid-x">
                                      <div className="cell small-6">
                                        <h5>Loan Term</h5>
                                      </div>
                                      <div className="cell small-6">
                                        <h5><em>{item.term} Months</em></h5>
                                      </div>
                                    </div>
                                    <div className="grid-x">
                                      <div className="cell small-6">
                                        <h5>Interest Rate</h5>
                                      </div>
                                      <div className="cell small-6">
                                        <h5><em>{formatCurrency(item.rate, 2) || '-'}%</em></h5>
                                      </div>
                                    </div>
                                    <div className="grid-x">
                                      <div className="cell small-6">
                                        <h5>APR</h5>
                                      </div>
                                      <div className="cell small-6">
                                        <h5><em>{formatCurrency(item.apr, 3) || '-'}%</em></h5>
                                      </div>
                                    </div>
                                    <Grid>
                                      <Column className="small-6">
                                        <h5>Origination Fee*</h5>
                                        <small>Included in the monthly payment</small>
                                      </Column>
                                      <Column className="small-6">
                                        {/* <h5><em>%{formatCurrency(item.fees, 2) || '-'}</em></h5> */}
                                        <h5><em>{Number(formatCurrency(item.originationPercentage, 2)) * 100 || '-'}%</em></h5>
                                      </Column>
                                    </Grid>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                          <Button
                            className="button large arrow green w-100"
                            isDisabled={selectedIndex === -1 || !confirmAmountOfSale}
                            onClick={this.handleDisplayModal}
                          >
                            Review &amp; Confirm Your Loan
                          </Button>
                          <Column className="small-12 medium-12">
                            <p className={style.description}>
                              * The Origination Fee is 8% of the Amount Financed, is non-refundable, and is considered earned upon the funding of your loan. You can calculate the dollar amount of the Origination Fee for each offer listed above by multiplying the Amount Financed figure for that offer by .08. For example, if the Amount Financed is $1,000 the corresponding Origination Fee would be $80 ($1000 x .08 = $80). The total Principal Amount of your loan is the sum of the Amount Financed and the Origination Fee (i.e. if the Amount Financed is $1,000 the Principal Amount of the loan would be $1080). Please review your Loan Agreement for additional terms and conditions.
                            </p>
                          </Column>
                          <Column className="small-12 medium-12">
                            <p className={style.description}>
                              ** No Interest on Principal Option Promotion. Your loan has a 6-month no interest on principal promotion included. This promotion can save you money as referenced in the &#34;SPECIAL OFFER&#34; section above provided you pay off the principal amount of the loan in full within the first 6 months. During the 6-month promotional period you will be responsible for making all of your monthly payments and your loan will accrue interest on a monthly basis. If you pay off your loan within the promotional period, the monthly payments that you have made during this period, which includes accrued interest, will be deducted from the principal amount of the loan. The principal amount includes the non-refundable 8% Origination Fee. Please review your Loan Agreement for terms and conditions.
                            </p>
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
          <Modal
            className={style.modal}
            isShown={isModalShown}
            onClose={this.toggleModal}
            canBeClosedByEsc
            isLogoShown={false}
          >
            <div className={style['card-header']}>
              <h5>Please Confirm the Following</h5>
            </div>
            <div className="grid-x">
              <div className="cell small-12">
                <FormGroup className={cn('form-group', style.formGroup)}>
                  <div className="grid-x grid-margin-x">
                    <div className="cell small-12 medium-6">
                      <Input
                        name="channel.attributes.serviceProvider.phone"
                        label="Amount Financed"
                        isBadgeVisible={false}
                        value={formatCurrency(get(workflow, 'state.data.approvalAmount'), 2)}
                        readOnly
                        isMasked={currencyMask}
                      />
                    </div>
                    <div className="cell small-12 medium-6">
                      <Input
                        name="channel.attributes.serviceProvider.phone"
                        label="Payout Amount"
                        defaultValue="$2,000"
                        isBadgeVisible={false}
                        value={formatCurrency(get(workflow, `state.data.offers.${selectedIndex}.payoutAmount`), 2)}
                        isMasked={currencyMask}
                        readOnly
                        errorMessage={confirmAmountOfSaleError}
                      />
                    </div>
                    <div className="cell small-12 medium-6">
                      <div className={cn('has-value', style.hasValue)}>
                        <span className={style.layerOrder}>Purchase/Service Date</span>
                        <Datetime
                          name="channel.attributes.serviceProvider.phone"
                          label="Purchase/Service Date"
                          className={cn(className, style.input)}
                          value={purchaseDate || ''}
                          onChange={this.handleDateChange}
                          closeOnSelect
                          dateFormat="MM/DD/YY"
                          timeFormat={false}
                        />
                        <div className={style.error}>{purchaseDateError}</div>
                      </div>
                    </div>
                  </div>
                  <div className="cell small-12 checkbox-row padded-bottom">
                    <Checkbox
                      label={['I certify that the amount taken only includes services or products to be rendered. No origination fees or any other finance fees have been added. Non compliances will result in all funds being charged back and loan cancellation. Additionally, it is understood that I am not to attempt to collect additional fees directly from the customer in order to make up for the discount fees that I am incurring.']}
                      name="hasApplicationConsented"
                      onChange={this.handleCheckboxChange.bind(null, 'isChecked1')}
                      isChecked={isChecked1}
                      id="hasApplicationConsented"
                      errorMessage={isChecked1Error}
                    />
                  </div>
                  <div className="cell small-12 checkbox-row padded-bottom">
                    <Checkbox
                      label={['I certify that I have identified the borrower with a valid government issued ID and have retained a copy for my records which will be provided to LendingUSA upon request.']}
                      name="isCertified"
                      onChange={this.handleCheckboxChange.bind(null, 'isChecked2')}
                      isChecked={isChecked2}
                      id="isCertified"
                      errorMessage={isChecked2Error}
                    />
                  </div>
                  <div className="cell small-12">
                    <Input
                      name="channel.attributes.serviceProvider.phone"
                      label="Authorized Representative Signature"
                      defaultValue=""
                      onChange={this.handleChange}
                      isBadgeVisible={false}
                      value={signature}
                      errorMessage={signatureError}
                    />
                  </div>
                  <Button
                    className={cn('button large arrow green w-100', style.button)}
                    onClick={this.handleFinalizeSale}
                    isLoading={isLoading}
                  >
                    Finalize Sale
                  </Button>
                  <Button
                    className={cn('button large arrow red w-100', style.button)}
                    onClick={this.toggleModal}
                  >
                    Cancel
                  </Button>
                </FormGroup>
              </div>
            </div>
          </Modal>
        </Fragment>
        :
        <div />
    );
  }
}

CreditAppDecision.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
  updateOffer: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

CreditAppDecision.defaultProps = {
  className: '',
};

export default compose(
  withRouter,
  connect(
    state => ({
      workflow: state.workflow,
    }),
    {
      nextAction,
      updateOffer,
      checkPreviousAction,
    }
  )
)(CreditAppDecision);
