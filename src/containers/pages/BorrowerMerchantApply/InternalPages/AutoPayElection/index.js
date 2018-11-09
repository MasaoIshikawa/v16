import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import { compose } from 'redux';

import Header from 'components/Header';
import Footer from 'components/Footer';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Form/Input';
import FormGroupLabel from 'components/FormGroupLabel';
import { Grid, Column } from 'components/Layout';
import { Button, ButtonLink } from 'components/Button';
import Checkbox from 'components/Form/Checkbox';
import Select from 'components/Form/Select';
import Validator from 'components/Validator/Validator';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import get from 'lodash/get';

import {
  nextAction,
  checkPreviousAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';

import schema from './schema';
import style from './style.scss';

const numberMask = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: '',
  allowLeadingZeroes: true,
});

class AutoPayElection extends Component {
  state = {
    // eslint-disable-next-line
    isChecked: false,
    isLoading: false,
    isPopupVisible: false,
    isPreloaded: false,
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow, validator: { setValues } } = this.props;
    if (get(workflow, 'state.data') === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    }
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    } else {
      this.props.checkPreviousAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/checkin`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
          const initialBankData = {
            accountHolderName: get(response, 'state.data.bankAccount.accountHolderName') || '',
            bankName: get(response, 'state.data.bankAccount.bankName') || '',
            routingNumber: get(response, 'state.data.bankAccount.routingNumber') || '',
            accountNumber: get(response, 'state.data.bankAccount.accountNumber') || '',
            accountType: get(response, 'state.data.bankAccount.accountType') || 'checking',
          };
          setValues(initialBankData);
          if (get(response, 'state.data.bankAccount.accountHolderName')) {
            this.setState({
              isPreloaded: true,
            });
          }
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.props.history.replace(`/applications/${this.props.match.params.workflowtype}/application?applicationId=${params.applicationId}`);
        },
      });
    }
  }

  setFormRef = (el) => { this.form = el; }

  toggleModal = () => {
    this.setState(({ isModalShown }) => ({ isModalShown: !isModalShown }));
  }

  handleCheckboxChange = (name, value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(name, value);
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  };

  handleSubmitForm = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      const { validator: { values, validate } } = this.props;
      if ((values.isSelfSubmitted === 1 && validate(schema).isValid) || (values.isSelfSubmitted === 2)) {
        this.setState({
          isLoading: true,
        });
        this.props.nextAction({
          data: {
            ...values,
            isAutoPay: values.isSelfSubmitted === 1,
          },
          url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
          success: (response) => {
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
      } else {
        validate(schema);
      }
    }
  }

  togglePopup = (e) => {
    e.preventDefault();
    this.setState(prev => ({ isPopupVisible: !prev.isPopupVisible }));
  }

  render() {
    const { validator: { values, errors, isValid } } = this.props;
    const { isLoading, isPopupVisible, isPreloaded } = this.state;

    if (this.form && !isValid) {
      const errs = Object.keys(errors);
      this.form[errs[0]].focus();
      window.scrollTo(0, 450);
    }

    return (
      <Fragment>
        <form onSubmit={this.handleSubmitForm.bind(null, values)} ref={this.setFormRef}>
          <Header />
          <section className="container section">
            <div className={cn('grid-container fluid', style.autoPayHeader)} />
            <div className="grid-container fluid borrowers-apply page-autopay">
              <div className="grid-container">
                <div className="grid-x grid-margin-x max-limited">
                  <div className={cn('cell small-12 large-8 large-offset-2 form-headline', style.formHeadline)}>
                    <h2>Auto-Pay Election</h2>
                    <p className="p-large">
                      Enroll in optional Auto-Pay for free and never miss a payment again.<br />
                      <em className={style.pLargeEm}>Plus enroll in optional Auto-Pay and you could earn a <strong>$25 Statement Credit</strong>.&nbsp; <ButtonLink onClick={this.togglePopup} className={style.viewDetail}>View Details</ButtonLink></em>
                    </p>
                  </div>
                  <div className="cell small-12 large-8 large-offset-2">
                    <FormGroup className="form-group">
                      <FormGroupLabel value="Bank ACH Information" />
                      <div className="grid-x grid-margin-x">
                        <div className="cell small-12 medium-6">
                          <Input
                            label="Bank Name"
                            isRequired
                            value={values.bankName}
                            onChange={this.handleInputChange}
                            name="bankName"
                            hasError={!!errors.bankName}
                            errorMessage={errors.bankName}
                          />
                        </div>
                        <div className="cell small-12 medium-6">
                          <Input
                            name="accountHolderName"
                            label="Name on Account"
                            isRequired
                            value={values.accountHolderName}
                            onChange={this.handleInputChange}
                            hasError={!!errors.accountHolderName}
                            errorMessage={errors.accountHolderName}
                            isDisabled={isPreloaded}
                          />
                        </div>
                        <div className="cell small-12 medium-6">
                          <Input
                            name="routingNumber"
                            label="ABA Routing Number"
                            onChange={this.handleInputChange}
                            isRequired
                            value={values.routingNumber}
                            isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                            hasError={!!errors.routingNumber}
                            errorMessage={errors.routingNumber}
                          />
                        </div>
                        <div className="cell small-12 medium-6">
                          <Input
                            name="accountNumber"
                            label="Account Number"
                            onChange={this.handleInputChange}
                            isRequired
                            value={values.accountNumber}
                            isMasked={numberMask}
                            hasError={!!errors.accountNumber}
                            errorMessage={errors.accountNumber}
                          />
                        </div>
                        <div className="cell small-12 medium-6">
                          <Select
                            data={[
                              { value: 'checking', title: 'Checking' },
                              { value: 'savings', title: 'Savings' },
                            ]}
                            name="accountType"
                            label="Account Type"
                            placeholder="Select..."
                            onChange={this.handleInputChange}
                            isRequired
                            hasError={!!errors.accountType}
                            errorMessage={errors.accountType}
                            value={values.accountType}
                          />
                        </div>
                      </div>
                    </FormGroup>
                    <FormGroup className="form-group">
                      <FormGroupLabel value="Enroll in Auto-Pay" />
                      <Grid>
                        <div className="cell small-12 padded-bottom padded-bottom-small">
                          <div className="grid-x grid-margin-x">
                            <div className={cn('cell small-12 medium-6 padded-bottom-small', style['radio-container'])}>
                              <div className={cn(style['select-highlight'], (values.isSelfSubmitted === 1 || !values.isSelfSubmitted) && style.selected)} />
                              <Checkbox
                                label={[
                                  <strong>YES</strong>,
                                  <Fragment>  &nbsp;–&nbsp;  </Fragment>,
                                  'I want to enroll in ACH Auto-Pay and become eligible to receive a $25 statement credit!',
                                  <Fragment> &nbsp;</Fragment>,
                                  <ButtonLink onClick={this.togglePopup} className={style.viewDetailCheckbox}>View Details</ButtonLink>,
                                ]}
                                className={style.checkboxLabel}
                                name="isSelfSubmitted"
                                onChange={this.handleCheckboxChange.bind(null, 'isSelfSubmitted', 1)}
                                isChecked={values.isSelfSubmitted === 1}
                                value="on"
                                id="isSelfSubmitted"
                                type="radio"
                              />
                              <small className={style.small}>Paying via ACH Auto-Pay is FREE and assures you pay on time each month.</small>
                            </div>
                            <div className={cn('cell small-12 medium-6 padded-bottom-small', style['radio-container'])}>
                              <div className={cn(style['select-highlight'], values.isSelfSubmitted === 2 && style.selected)} />
                              <Checkbox
                                label={[
                                  <strong>NO</strong>,
                                  <Fragment> &nbsp;-&nbsp; </Fragment>,
                                  'I do not want to Enroll in ACH Auto-Pay at this time. All debit card payments, including debit card Auto-Pay, may incur additional fees.',
                                ]}
                                className={style.checkboxLabel}
                                name="isSelfSubmitted"
                                onChange={this.handleCheckboxChange.bind(null, 'isSelfSubmitted', 2)}
                                isChecked={values.isSelfSubmitted === 2}
                                id="isSelfSubmittedNo"
                                value="off"
                                type="radio"
                              />
                            </div>
                            <Column className={cn('small-12 medium-6 padded-bottom-small', style['radio-container'])}>
                              <span className={style.error}>{errors.isSelfSubmitted}</span>
                            </Column>
                          </div>
                        </div>
                        <div className={cn('cell small-12 padded-top', style.formHeadline)}>
                          <p>
                            <em>Please Note:</em> Enrolling in ACH Auto-Pay is optional. The Bank&apos;s credit decision is not dependent on whether you enroll in ACH Auto-Pay. You can change your method of payment at any time in the future.
                          </p>
                        </div>
                        <div className="cell small-12 large-12 padded-bottom padded-bottom-small">
                          <Button
                            className={cn('button large green w-100', style.button, isLoading ? '' : 'arrow')}
                            onClick={this.handleSubmitForm}
                            isLoading={isLoading}
                          >
                            Save & Continue
                          </Button>
                        </div>
                      </Grid>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
          {/* <!-- Disclaimer Modal --> */}
          <div className={cn('reveal', style.reveal, !isPopupVisible && style.invisible)}>
            <div className={style['card-header']}>
              <h5>Promotion Details</h5>
            </div>
            <p>*To qualify for the $25 Statement Credit (“Statement Credit”) Promotion (“Promotion”), you must enroll in optional ACH Auto-Pay (“Auto-Pay”) at the same time that you execute your loan agreement with Cross River Bank and successfully make your first 3 scheduled monthly payments using Auto-Pay. Each monthly payment must post to your loan account prior to the expiration of any applicable grace period. You understand that you are not required to enroll in Auto-Pay unless you want to take advantage of this promotional offer, and your willingness to enroll in Auto-Pay will not affect Cross River Bank’s credit decision regarding your loan application. Limit one (1) Statement Credit per loan. Promotion cannot be transferred or assigned. After making your first 3 scheduled monthly payments using Auto-Pay payment, the Statement Credit will be applied to the next scheduled payment. The Statement Credit will be applied to the account pursuant to the ‘Application of Payments’ section in your Loan Agreement. Enrollment for the Statement Credit/Promotion must be made before December 31, 2018. This Promotion is subject to change or discontinuation without notice.
            </p>
            <button className="close-button" data-close aria-label="Close reveal" type="button" onClick={this.togglePopup}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {/* <!-- End Disclaimer Modal --> */}
        </form>
      </Fragment>
    );
  }
}

AutoPayElection.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  validator: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
};

AutoPayElection.defaultProps = {
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
      workflow: state.workflow,
    }),
    {
      nextAction,
      checkPreviousAction,
    }
  )
)(AutoPayElection);
