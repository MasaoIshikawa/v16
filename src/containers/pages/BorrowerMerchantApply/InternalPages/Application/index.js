import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import emailMask from 'text-mask-addons/dist/emailMask';
import get from 'lodash/get';

import Validator from 'components/Validator/Validator';
import Header from 'components/Header';
import Footer from 'components/Footer';
import FormGroup from 'components/Form/FormGroup';
import FormGroupLabel from 'components/FormGroupLabel';
import LoanAmountRequested from 'components/LoanAmountRequested';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import Checkbox from 'components/Form/Checkbox';
import { Button, VerifyButton } from 'components/Button';
import Sidebar from 'components/Sidebar';
import { Grid, Column } from 'components/Layout';
import Popup from 'components/Popup';
import PopoverCheckbox from 'components/Form/PopoverCheckbox';
import { appConfig } from 'config/appConfig';

import {
  getIPAddress,
  checkinAction,
  checkPreviousAction,
} from 'actions/workflow';

import { verifyAddress } from 'utils/verifyAddress';
import { toTitleCase } from 'utils/toTitleCase';
import { unSupportedStates } from 'utils/unSupportedStates';
import { parseUrlParams } from 'utils/parseUrlParams';
import { currencyMask, unmask } from 'utils/masks';
import { getCurrentDate } from 'utils/func';
import schema from './schema';
import style from './style.scss';

const params = parseUrlParams(window.location.search);
class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      response: {},
      isLoading: false,
      isSubmitted: false,

      isAddressLoading: false,
      isAddressPopupVisible: false,
      isVerified: false,
      isFirstLoad: true,
      popupType: null,
      isVerifyButtonClicked: false,
      grossMonthlyIncomeDescription: null,
    };
  }

  componentWillMount() {
    const { validator: { setValues } } = this.props;
    const initialFormData = {
      requestedAmount: 1000,
      signatureBy: {
        date: getCurrentDate(),
      },
      isPersonReceivingService: true,
      merchant: {
        merchantId: localStorage.getItem('merchantId'),
        name: 'Dr.John Smith',
        phone: '111-111-1111',
      },
      channel: {
        code: 'dtm',
        name: 'DTM',
        type: 'dtm',
      },
    };
    setValues(initialFormData);
  }

  setFormRef = (el) => { this.form = el; }

  handleSubmitForm = (data, e) => {
    e.preventDefault();
    const { validator: { validate, errors } } = this.props;
    this.setState({ isSubmitted: true });

    const isAddressValid = appConfig.smartyStreetEnforce ? this.state.isVerified : true;
    if (validate(schema).isValid && isAddressValid) {
      this.setState({
        isLoading: true,
      });
      this.props.getIPAddress({
        data: {},
        success: (ipResponse) => {
          const formData = {
            ...data,
            merchant: {
              ...data.merchant,
              merchantId: localStorage.getItem('merchantId') ? localStorage.getItem('merchantId') : params.pid,
            },
            applicant: {
              ...data.applicant,
              addresses: [{
                ...data.applicant.addresses,
                country: 'USA',
              }],
              phoneNumbers: [
                {
                  Type: 'Mobile',
                  Number: data.applicant.phoneNumbers.Number,
                },
              ],
            },
            financials: {
              stated: {
                ...data.financials.stated,
                source: 'application',
                grossMonthlyIncome: unmask(data.financials.stated.grossMonthlyIncome),
                monthlyRentOrMortage: unmask(data.financials.stated.monthlyRentOrMortage),
              },
            },
            referral: {
              affiliateId: params.aid,
              sourceIP: ipResponse.ip,
              url: window.location.href,
            },
          };

          this.props.checkinAction({
            data: formData,
            url: `/workflows/application/workflow/${this.props.match.params.workflowtype}/start`,
            success: (response) => {
              this.setState({
                // eslint-disable-next-line
                response: response,
                isLoading: false,
              });
              this.props.history.push(response.state.url);
            },
            fail: (error) => { // eslint-disable-line
              this.props.history.push({
                pathname: `/applications/${this.props.match.params.workflowtype}/general-error-page`,
                search: '',
                state: {
                  data: error.data,
                },
              });
            },
          });
        },
      });
    } else {
      console.log('api error', errors, !this.state.isVerified && 'address is not verified');
    }
  };

  handleInputChange = (event) => {
    const { validator: { onChangeHandler, values } } = this.props;
    switch (event.target.name) {
      case 'applicant.addresses.state':
        this.initializeAddressState();
        if (unSupportedStates.indexOf(event.target.value) !== -1) {
          this.setState({
            isAddressPopupVisible: true,
            isAddressLoading: false,
            popupType: 4,
          });
        } else {
          // eslint-disable-next-line
          if (this.state.isFirstLoad && get(values, 'applicant.addresses.city') && get(values, 'applicant.addresses.address')) {
            this.verifySmartyStreet({
              zipcode: get(values, 'applicant.addresses.zipcode'),
              address: get(values, 'applicant.addresses.address'),
              city: get(values, 'applicant.addresses.city'),
              state: event.target.value,
            });
          }
        }
        onChangeHandler(event.target.name, event.target.value);
        break;
      case 'applicant.firstName':
      case 'applicant.lastName':
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z '-]/g, ''));
        break;
      case 'financials.stated.employerName':
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z '-]/g, ''));
        break;
      case 'applicant.addresses.zipcode':
        this.initializeAddressState();
        onChangeHandler(event.target.name, event.target.value);
        break;
      case 'applicant.addresses.address':
      case 'applicant.addresses.city':
        this.initializeAddressState();
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z0-9- ']/g, ''));
        break;
      case 'financials.stated.grossMonthlyIncome':
        onChangeHandler(event.target.name, event.target.value);
        this.setState({
          grossMonthlyIncomeDescription: null,
        });
        break;
      default:
        onChangeHandler(event.target.name, event.target.value);
    }
  };

  initializeAddressState = () => {
    this.setState({
      isVerified: false,
      isSubmitted: false,
      isVerifyButtonClicked: false,
    });
  }

  handleCheckboxChange = (name, value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(name, value);
  };

  handleSliderChange = (value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler('requestedAmount', value);
  };

  handleSetValues = (e) => {
    e.preventDefault();
    const { validator: { setValues } } = this.props;
    const formValues = {
      requestedAmount: 4320,
      merchantId: localStorage.getItem('merchantId'),
      channel: {
        code: 'dtm',
        name: 'DTM',
        type: 'dtm',
      },
      applicant: {
        firstName: 'EUNICE',
        lastName: 'BOLT',
        addresses: {
          address: '400 ELIZABETH ST',
          city: 'CHARLEROI',
          state: 'PA',
          zipcode: '15022',
        },
        dateOfBirth: '02/20/1948',
        ssn: '666386118',
        email: 'john.doe9010@lendingusa.com',
        phoneNumbers: {
          Number: '(919) 780-8674',
        },
      },
      financials: {
        stated: {
          grossMonthlyIncome: '5000',
          rentOrOwn: 'rent',
          monthlyRentOrMortage: '1500',
          employmentStatus: 'employed',
          employerName: 'John',
          employerPhone: '(233) 446-5342',
          employmentYears: '6',
        },
      },
      isPersonReceivingService: true,
      signatureBy: {
        name: 'EUNICE BOLT',
        date: getCurrentDate(),
      },
      ConsentToForward: true,
      ConsentElectronicCommunication: true,
      ConsentToCredit: true,
      Parameters: {
        pid: params.pid || '',
      },
    };
    setValues(formValues);
  }

  handleBlur = (event) => {
    event.preventDefault();

    const { validator: { onChangeHandler, values } } = this.props;
    switch (event.target.name) {
      case 'applicant.addresses.state':
        break;
      case 'applicant.addresses.zipcode':
        if (this.state.isFirstLoad && get(values, 'applicant.addresses.city') && get(values, 'applicant.addresses.state') && get(values, 'applicant.addresses.address')) {
          this.verifySmartyStreet({
            zipcode: event.target.value,
            address: get(values, 'applicant.addresses.address'),
            city: get(values, 'applicant.addresses.city'),
            state: get(values, 'applicant.addresses.state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      case 'applicant.addresses.address':
        if (this.state.isFirstLoad && get(values, 'applicant.addresses.city') && get(values, 'applicant.addresses.state')) {
          this.verifySmartyStreet({
            zipcode: get(values, 'applicant.addresses.zipcode'),
            address: toTitleCase(event.target.value),
            city: get(values, 'applicant.addresses.city'),
            state: get(values, 'applicant.addresses.state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      case 'applicant.addresses.city':
        if (this.state.isFirstLoad && get(values, 'applicant.addresses.address') && get(values, 'applicant.addresses.state')) {
          this.verifySmartyStreet({
            zipcode: get(values, 'applicant.addresses.zipcode'),
            address: get(values, 'applicant.addresses.address'),
            city: toTitleCase(event.target.value),
            state: get(values, 'applicant.addresses.state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      case 'applicant.email':
        onChangeHandler(event.target.name, event.target.value.toLowerCase());
        break;
      case 'financials.stated.grossMonthlyIncome':
        if (Number(unmask(event.target.value)) > 41600 || Number(unmask(event.target.value)) < 1) {
          this.setState({
            grossMonthlyIncomeDescription: 'The amount you entered must be your gross MONTHLY income.',
          });
        }
        break;
      default:
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
    }
  }

  handleAbort = () => {
    this.setState({
      isAddressPopupVisible: false,
    });
  }

  handleVerifyAddressClick = (e) => {
    e.preventDefault();

    const { validator: { values } } = this.props;

    if (!get(values, 'applicant.addresses.address')) {
      this.setState({
        isAddressPopupVisible: true,
        popupType: 1,
        isVerifyButtonClicked: true,
      });
    } else {
      this.verifySmartyStreet({
        address: get(values, 'applicant.addresses.address'),
        city: get(values, 'applicant.addresses.city'),
        state: get(values, 'applicant.addresses.state'),
        zipcode: get(values, 'applicant.addresses.zipcode'),
      });
    }
  }

  handleUndo = (e) => {
    e.preventDefault();

    const { validator: { values, setValues } } = this.props;
    const addressData = {
      ...values,
      address: get(this.state, 'prevAddresses.address'),
      city: get(this.state, 'prevAddresses.city'),
      state: get(this.state, 'prevAddresses.state'),
      zipcode: get(this.state, 'prevAddresses.zipcode'),
    };

    this.setState({
      isVerified: false,
    });
    setValues(addressData);
  }

  verifySmartyStreet = ({ address, city, state, zipcode }) => {
    const { validator: { values, setValues } } = this.props;

    this.setState({
      isAddressLoading: true,
      isVerifyButtonClicked: true,
    });

    verifyAddress({ zipcode, address, city, state }).then((response) => {
      if (response) {
        if (get(response, 'metadata.recordType') === 'P') {
          this.setState({
            isAddressPopupVisible: true,
            isAddressLoading: false,
            isVerified: false,
            popupType: 3,
            isFirstLoad: false,
          });
        } else {
          const addressData = {
            ...values,
            applicant: {
              ...values.applicant,
              addresses: {
                ...values.applicant.addresses,
                address: response.deliveryLine1,
                city: get(response, 'components.cityName'),
                state: get(response, 'components.state'),
                zipcode: `${response.deliveryPointBarcode}`.slice(0, 5),
              },
            },
          };
          this.setState({
            isVerified: true,
            isAddressLoading: false,
            isFirstLoad: false,
            // eslint-disable-next-line
            prevAddresses: { address, city, state, zipcode },
          });
          setValues(addressData);
        }
      } else {
        this.setState({
          isAddressPopupVisible: true,
          isAddressLoading: false,
          isFirstLoad: false,
          isVerified: false,
          popupType: 2,
        });
      }
    }).catch((error) => {
      console.log('error', error);
      this.setState({
        isAddressLoading: false,
        popupType: 1,
        isFirstLoad: false,
        isVerified: false,
      });
    });
  }

  render() {
    const { className, validator: { values, errors, isValid } } = this.props;
    const {
      isLoading,
      isAddressLoading,
      isAddressPopupVisible,
      isVerified,
      popupType,
      isSubmitted,
      isVerifyButtonClicked,
      grossMonthlyIncomeDescription,
    } = this.state;

    let isFormValid = isValid;
    if (!get(errors, 'applicant.addresses.address') && isSubmitted && !isVerified) {
      errors['applicant.addresses.address'] = isVerifyButtonClicked ? 'Address is not valid, please enter valid address' : 'Please click verify Address';
      isFormValid = false;
    }

    if (this.form && !isFormValid && isSubmitted) {
      const errs = Object.keys(errors);
      this.form[errs[0]].focus();
      this.setState({ isSubmitted: false });
    }

    return (
      <form className={cn(style.App, className)} onSubmit={this.handleSubmitForm.bind(null, values)} ref={this.setFormRef}>
        <Header />
        <Button
          className={cn('button small w-50', style.button)}
          onClick={this.handleSetValues}
        >
          Set values
        </Button>
        <section className="container section">
          <div className="grid-container fluid borrowers-apply">
            <div className="grid-container">
              <Grid className="max-limited" style={{ marginBottom: '40px' }}>
                <Column className="small-12 medium-12">
                  <h2>Check Your Rate</h2>
                  <p className="p-large">Checking your rate takes seconds and won&apos;t impact your credit score✝</p>
                </Column>
              </Grid>

              <Grid className="max-limited">
                {
                  <Fragment>
                    <Column className="small-12 large-8 main-column">
                      <FormGroup className={cn('form-group', style.LoanAmountRequested)}>
                        <LoanAmountRequested
                          amount={values.requestedAmount}
                          onChange={this.handleSliderChange}
                          style={{ marginTop: '40px' }}
                        />
                      </FormGroup>

                      <FormGroup className="form-group">
                        <FormGroupLabel value="Personal Information" />
                        <Grid className="grid-margin-x">
                          <Column className="small-12 medium-6">
                            <p>Please provide the legal name and personal identity information for the primary borrower.</p>
                          </Column>
                          <Column className="small-12 medium-6">
                            <p>Enter the address of the primary borrower above. Must be a valid street address, no P.O. Boxes.</p>
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              label="First Name"
                              name="applicant.firstName"
                              value={values.applicant && values.applicant.firstName}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['applicant.firstName']}
                              errorMessage={errors['applicant.firstName']}
                              onBlur={this.handleBlur}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              label="Last Name"
                              name="applicant.lastName"
                              value={values.applicant && values.applicant.lastName}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['applicant.lastName']}
                              errorMessage={errors['applicant.lastName']}
                              onBlur={this.handleBlur}
                            />
                          </Column>
                          <Column className={cn('small-12 medium-12', style.positionRelative)}>
                            <Input
                              label="Street Address"
                              name="applicant.addresses.address"
                              value={values.applicant && values.applicant.addresses && values.applicant.addresses.address}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['applicant.addresses.address']}
                              errorMessage={errors['applicant.addresses.address']}
                              onBlur={this.handleBlur}
                              className={style.streetAddress}
                            />
                            <VerifyButton
                              onClick={isVerified ? this.handleUndo : this.handleVerifyAddressClick}
                              isVerified={isVerified}
                              isLoading={isAddressLoading}
                            />
                            { isAddressPopupVisible &&
                              <Popup
                                handleOverride={this.handleOverride}
                                handleAbort={this.handleAbort}
                                type={popupType}
                                data={{
                                  address: get(values, 'applicant.addresses.address'),
                                  city: get(values, 'applicant.addresses.city'),
                                  state: get(values, 'applicant.addresses.state'),
                                  zipcode: get(values, 'applicant.addresses.zipcode'),
                                }}
                              />
                            }
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              label="City"
                              name="applicant.addresses.city"
                              value={values.applicant && values.applicant.addresses && values.applicant.addresses.city}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['applicant.addresses.city']}
                              errorMessage={errors['applicant.addresses.city']}
                              onBlur={this.handleBlur}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Grid className="grid-margin-x">
                              <Column className="small-8">
                                <Select
                                  name="applicant.addresses.state"
                                  data={[
                                    { value: 'AA', title: 'Armed Forces - Americas' },
                                    { value: 'AE', title: 'Armed Forces - Europe' },
                                    { value: 'AK', title: 'Alaska' },
                                    { value: 'AL', title: 'Alabama' },
                                    { value: 'AP', title: 'Armed Forces - Pacific' },
                                    { value: 'AR', title: 'Arkansas' },
                                    { value: 'AS', title: 'American Samoa' },
                                    { value: 'AZ', title: 'Arizona' },
                                    { value: 'CA', title: 'California' },
                                    { value: 'CO', title: 'Colorado' },
                                    { value: 'CT', title: 'Connecticut' },
                                    { value: 'DC', title: 'District of Columbia' },
                                    { value: 'DE', title: 'Delaware' },
                                    { value: 'FL', title: 'Florida' },
                                    { value: 'GA', title: 'Georgia' },
                                    { value: 'GU', title: 'Guam' },
                                    { value: 'HI', title: 'Hawaii' },
                                    { value: 'IA', title: 'Iowa' },
                                    { value: 'ID', title: 'Idaho' },
                                    { value: 'IL', title: 'Illinois' },
                                    { value: 'IN', title: 'Indiana' },
                                    { value: 'KS', title: 'Kansas' },
                                    { value: 'KY', title: 'Kentucky' },
                                    { value: 'LA', title: 'Louisiana' },
                                    { value: 'MA', title: 'Massachusetts' },
                                    { value: 'MD', title: 'Maryland' },
                                    { value: 'ME', title: 'Maine' },
                                    { value: 'MI', title: 'Michigan' },
                                    { value: 'MN', title: 'Minnesota' },
                                    { value: 'MO', title: 'Missouri' },
                                    { value: 'MP', title: 'Northern Mariana Islands' },
                                    { value: 'MS', title: 'Mississippi' },
                                    { value: 'MT', title: 'Montana' },
                                    { value: 'NC', title: 'North Carolina' },
                                    { value: 'ND', title: 'North Dakota' },
                                    { value: 'NE', title: 'Nebraska' },
                                    { value: 'NH', title: 'New Hampshire' },
                                    { value: 'NJ', title: 'New Jersey' },
                                    { value: 'NM', title: 'New Mexico' },
                                    { value: 'NV', title: 'Nevada' },
                                    { value: 'NY', title: 'New York' },
                                    { value: 'OH', title: 'Ohio' },
                                    { value: 'OK', title: 'Oklahoma' },
                                    { value: 'OR', title: 'Oregon' },
                                    { value: 'PA', title: 'Pennsylvania' },
                                    { value: 'PR', title: 'Puerto Rico' },
                                    { value: 'PW', title: 'Palau' },
                                    { value: 'RI', title: 'Rhode Island' },
                                    { value: 'SC', title: 'South Carolina' },
                                    { value: 'SD', title: 'South Dakota' },
                                    { value: 'TN', title: 'Tennessee' },
                                    { value: 'TX', title: 'Texas' },
                                    { value: 'UT', title: 'Utah' },
                                    { value: 'VA', title: 'Virginia' },
                                    { value: 'VI', title: 'Virgin Islands' },
                                    { value: 'VT', title: 'Vermont' },
                                    { value: 'WA', title: 'Washington' },
                                    { value: 'WI', title: 'Wisconsin' },
                                    { value: 'WV', title: 'West Virginia' },
                                    { value: 'WY', title: 'Wyoming' },
                                  ]}
                                  value={values.applicant && values.applicant.addresses && values.applicant.addresses.state}
                                  onChange={this.handleInputChange}
                                  label="State"
                                  isRequired
                                  hasError={!!errors['applicant.addresses.state']}
                                  errorMessage={errors['applicant.addresses.state']}
                                />
                              </Column>
                              <Column className="small-4">
                                <Input
                                  label="Zip"
                                  isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/]}
                                  name="applicant.addresses.zipcode"
                                  value={values.applicant && values.applicant.addresses && values.applicant.addresses.zipcode}
                                  onChange={this.handleInputChange}
                                  isRequired
                                  hasError={!!errors['applicant.addresses.zipcode']}
                                  errorMessage={errors['applicant.addresses.zipcode']}
                                />
                              </Column>
                            </Grid>
                            <Grid id="ResidentAlert" className="grid-margin-x hide">
                              <Column className="small-12">
                                <div className="alert callout">
                                  <p>We currently do not accept loan applications for residents of the state of <span className="state">state</span>.</p>
                                </div>
                              </Column>
                            </Grid>
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              label="Date of Birth"
                              name="applicant.dateOfBirth"
                              // eslint-disable-next-line
                              isMasked={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                              placeHolder="__/__/____"
                              value={values.applicant && values.applicant.dateOfBirth}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['applicant.dateOfBirth']}
                              errorMessage={errors['applicant.dateOfBirth']}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              label="Social Security #"
                              name="applicant.ssn"
                              // eslint-disable-next-line
                              isMasked={[/\d/,/\d/,/\d/, '-', /\d/,/\d/, '-',/\d/,/\d/,/\d/,/\d/]}
                              placeHolder="___-__-____"
                              value={values.applicant && values.applicant.ssn}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['applicant.ssn']}
                              errorMessage={errors['applicant.ssn']}
                            />
                          </Column>
                        </Grid>
                      </FormGroup>

                      <FormGroup className="form-group">
                        <FormGroupLabel value="Contact Information" />
                        <p>Loan and application status will be sent to the following.</p>
                        <Grid className="grid-margin-x">
                          <Column className="small-12 medium-6">
                            <Input
                              label="Email Address"
                              name="applicant.email"
                              isMasked={emailMask}
                              placeHolder="Email address"
                              value={values.applicant && values.applicant.email}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['applicant.email']}
                              errorMessage={errors['applicant.email']}
                              onBlur={this.handleBlur}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              label="Mobile Phone"
                              name="applicant.phoneNumbers.Number"
                              placeHolder="(___) ___-____"
                              isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              value={values.applicant && values.applicant.phoneNumbers && values.applicant.phoneNumbers.Number}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['applicant.phoneNumbers.Number']}
                              errorMessage={errors['applicant.phoneNumbers.Number']}
                            />
                          </Column>
                        </Grid>
                      </FormGroup>

                      <FormGroup className="form-group">
                        <FormGroupLabel value="Financials &amp; Employment" />
                        <p>Your total verifiable gross income might include your salary, retirement income or other sources of income. Alimony, child support or seperate maintenance income are optional.</p>
                        <Grid className="grid-margin-x">
                          <Column className="small-12 medium-6">
                            <Input
                              label="Gross Monthly Income"
                              name="financials.stated.grossMonthlyIncome"
                              value={values.financials && values.financials.stated && `${values.financials.stated.grossMonthlyIncome}`}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['financials.stated.grossMonthlyIncome'] || !!grossMonthlyIncomeDescription}
                              isMasked={currencyMask}
                              errorMessage={errors['financials.stated.grossMonthlyIncome'] || grossMonthlyIncomeDescription}
                              onBlur={this.handleBlur}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Select
                              name="financials.stated.rentOrOwn"
                              data={[
                                { value: 'own-home', title: 'Own Home' },
                                { value: 'rent', title: 'Rent' },
                                { value: 'live-with-parents', title: 'Live with parents' },
                                { value: 'other', title: 'Other' },
                              ]}
                              value={values.financials && values.financials.stated && values.financials.stated.rentOrOwn}
                              onChange={this.handleInputChange}
                              label="Rent/Own"
                              isRequired
                              hasError={!!errors['financials.stated.rentOrOwn']}
                              errorMessage={errors['financials.stated.rentOrOwn']}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              label="Monthly Rent/Mortgage"
                              name="financials.stated.monthlyRentOrMortage"
                              value={values.financials && values.financials.stated && `${values.financials.stated.monthlyRentOrMortage}`}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['financials.stated.monthlyRentOrMortage']}
                              isMasked={currencyMask}
                              errorMessage={errors['financials.stated.monthlyRentOrMortage']}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Select
                              name="financials.stated.employmentStatus"
                              data={[
                                { value: 'employed', title: 'Employed' },
                                { value: 'self-employed', title: 'Self-Employed' },
                                { value: 'unemployed', title: 'Unemployed' },
                                { value: 'student', title: 'Student' },
                                { value: 'retired', title: 'Retired' },
                                { value: 'military', title: 'Military' },
                              ]}
                              value={values.financials && values.financials.stated && values.financials.stated.employmentStatus}
                              onChange={this.handleInputChange}
                              label="Employment Status"
                              isRequired
                              hasError={!!errors['financials.stated.employmentStatus']}
                              errorMessage={errors['financials.stated.employmentStatus']}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              label="Employer Name"
                              name="financials.stated.employerName"
                              value={values.financials && values.financials.stated && values.financials.stated.employerName}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['financials.stated.employerName']}
                              errorMessage={errors['financials.stated.employerName']}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Input
                              name="financials.stated.employerPhone"
                              isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              label="Employer Phone"
                              placeHolder="(___) ___-____"
                              value={values.financials && values.financials.stated && values.financials.stated.employerPhone}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['financials.stated.employerPhone']}
                              errorMessage={errors['financials.stated.employerPhone']}
                            />
                          </Column>
                          <Column className="small-12 medium-6">
                            <Select
                              name="financials.stated.employmentYears"
                              data={[
                                { value: 'Less than 6 months', title: 'Less than 6 months' },
                                { value: '6 months – 1 year', title: '6 months – 1 year' },
                                { value: '1–2 Years', title: '1–2 Years' },
                                { value: '2–3 Years', title: '2–3 Years' },
                                { value: '3+ Years', title: '3+ Years' },
                              ]}
                              value={values.financials && values.financials.stated && values.financials.stated.employmentYears}
                              onChange={this.handleInputChange}
                              label="Years with Current Employer"
                              isRequired
                              hasError={!!errors['financials.stated.employmentYears']}
                              errorMessage={errors['financials.stated.employmentYears']}
                            />
                          </Column>
                        </Grid>
                      </FormGroup>

                      <FormGroup className="form-group">
                        <FormGroupLabel value="Your Signature" />
                        <Grid className="grid-margin-x">
                          <Column className="small-12 large-8 padded-bottom">
                            <h6>Is the applicant above the person receiving the product/services?</h6>
                          </Column>
                          <Column className={cn('small-12 large-4 padded-bottom padded-bottom-small', style.signatureConfirm)}>
                            <Checkbox
                              label={['Yes']}
                              name="isPersonReceivingService"
                              onChange={this.handleCheckboxChange.bind(null, 'isPersonReceivingService', true)}
                              isChecked={values.isPersonReceivingService}
                              value="on"
                              id="isPersonReceivingService"
                              type="radio"
                            />
                            <Checkbox
                              label={['No']}
                              name="isPersonReceivingServiceNo"
                              onChange={this.handleCheckboxChange.bind(null, 'isPersonReceivingService', false)}
                              isChecked={!values.isPersonReceivingService}
                              id="isPersonReceivingServiceNo"
                              value="off"
                              type="radio"
                            />
                          </Column>
                          <Column className="small-12 checkbox-row padded-bottom">
                            <h6>By checking the box below I agree to the following:</h6>
                          </Column>
                          <Column className="small-12">
                            <PopoverCheckbox
                              label={['Electronic Consent']}
                              name="ConsentToForward"
                              onChange={this.handleCheckboxChange.bind(null, 'ConsentToForward')}
                              isChecked={values.ConsentToForward}
                              id="ConsentToForward"
                              errorMessage={errors.ConsentToForward}
                            >
                              <b>CONSENT FOR ELECTRONIC SIGNATURES, RECORDS, AND DISCLOSURES (&#34;E-Consent&#34;)</b>
                              Please read this information carefully and print a copy and/or retain this information electronically for future reference.
                              <br />
                              <br />
                              <u><b>Introduction.</b></u> You are using this &apos;Portal&apos; or &apos;Website&apos; to a request for consumer financial services from LendingUSA and its assignees (hereinafter &#34;we,&#34; &#34;us,&#34; &#34;our,&#34; or &#34;Bank&#34;), among other services. To provide these services, we need your consent to using and accepting electronic signatures, records, and disclosures (&#34;E-Consent&#34;). This E-Consent notifies you of your rights when receiving disclosures, notices, and information from the Bank or LendingUSA as the operator of the Portal. By clicking &#34;CHECK MY RATE&#34; or other links assenting to our terms, you agree that you received this E-Consent and that you consent to using electronic signatures, records, and disclosures. Additionally, by clicking &#34;CHECK MY RATE&#34; or other links assenting to our terms, you consent to conduct transactions by using electronic disclosures, electronic records, and contract documents (&#34;Disclosures&#34;).
                              <br />
                              <br />
                              <u>Option for Paper or Non-Electronic Records.</u> You may request any Disclosures in paper copy by logging in and printing a paper copy. You may also mail your written request to LendingUSA, at the following address: 15303 Ventura Blvd. Suite 850, Sherman Oaks, CA 91403. We will provide paper copies at no charge. The Bank or its assignee will retain all Disclosures as applicable law requires.
                              <br />
                              <br />
                              <u><b>Scope of Consent.</b></u> This E-Consent applies to all interactions online concerning you and Bank and Lending USA and includes those interactions engaged in on any computer, electronic device, mobile device, including phones, smart-phones, fax machines, and tablets. Under this E-Consent, Bank and LendingUSA will process your information and interact during all online interactions with you electronically. The Disclosures you will receive electronically include federal disclosures, such as the Truth-in-Lending disclosures, Privacy Notices, and notices of our credit decisions, as well as state-specific notices. We will also send you notices electronically related to our interactions and transactions. This E-Consent informs you of your rights when receiving these Documents electronically.
                              <br /><br />
                              <u><b>Consenting to Do Business Electronically.</b></u> Before you decide to do business electronically with Bank or and LendingUSA, you should consider whether you have the required hardware and software capabilities described below.
                              <br /><br />
                              <u><b>Hardware and Software Requirements.</b></u> To access and retain the Disclosures electronically, you will need to use a computer or device capable of accessing the Internet and an Internet Browser software program that supports at least 256 bit encryption, such as Microsoft® Internet Explorer 11+, Safari 7+ and the evergreen Chrome, Firefox or Edge. To read some documents, you may need a PDF file reader like Adobe® Acrobat Reader Xpdf ® or Foxit®. If these requirements change while you are maintaining an active relationship with Bank, and the change creates a material risk that you may not be able to receive Disclosures electronically, Bank will notify you of these changes. You will need a printer or a long-term storage device, such as your computer&apos;s disk drive, to retain a copy of the Disclosures for future reference. You may send us your written questions regarding the hardware and software requirements to:
                              <br /><br />
                              <b>Email</b><br />
                              CustomerCare@LendingUSA.com
                              <br /><br />
                              <b>Call</b><br />
                              Our regular business hours are 9:00am to 5:00pm PST<br />
                              800-994-6177
                              <br /><br />
                              <b>Address for Regular Mail</b><br />
                              15303 Ventura Blvd. Suite 850<br />
                              Sherman Oaks, CA 91403
                              <br /><br />
                              <u><b>Withdrawing Consent.</b></u> You are free to withdraw this E-Consent at any time and at no charge. However, if you withdraw this E-Consent before receiving consumer financial services, this will prevent you from obtaining consumer financial services from us. If at any time you wish to withdraw this E-Consent, you can send us your written request by mail to LendingUSA at CustomerCare@LendingUSA.com with the details of such request. If you decide to withdraw this E-Consent, the withdrawal will not affect the legal effectiveness, validity, and enforceability of prior electronic Disclosures.
                              <br /><br />
                              <u><b>Change to Your Contact Information.</b></u> You agree to keep us informed of any change in your electronic address or mailing address. You may update such information by calling us or emailing us to provide the updated information. You may also send us your written update by mail to our address above.
                              <br /><br />
                              <u><b>YOUR ABILITY TO ACCESS DISCLOSURES.</b></u> BY CLICKING &#34;CHECK MY RATE&#34; OR OTHER LINKS, YOU ASSENT TO OUR TERMS. YOU ACKNOWLEDGE THAT YOU CAN ACCESS THE DISCLOSURES IN THE DESIGNATED FORMATS DESCRIBED ABOVE. Once you give your consent, you can log into the website to access these documents.
                              <br /><br />
                              <u><b>CONSENT.</b></u> BY CLICKING &#34;CHECK MY RATE&#34; OR OTHER LINKS, YOU ASSENT TO OUR TERMS. YOU ACKNOWLEDGE YOU HAVE READ THIS INFORMATION ABOUT ELECTRONIC SIGNATURES, RECORDS, DISCLOSURES, AND DOING BUSINESS ELECTRONICALLY. YOU CONSENT TO USING ELECTRONIC SIGNATURES, HAVING ALL DISCLOSURES PROVIDED OR MADE AVAILABLE TO YOU IN ELECTRONIC FORM AND TO DOING BUSINESS WITH US ELECTRONICALLY. YOU ACKNOWLEDGE THAT YOU MAY REQUEST A PAPER COPY OF THE ELECTRONIC RECORDS AND DISCLOSURES, WHICH WE WILL PROVIDE TO YOU AT NO CHARGE. IF YOU REFRAIN FROM PROCEEDING THEN YOU NEITHER WISH TO USE ELECTRONIC SIGNATURES NOR CONDUCT THIS TRANSACTION ELECTRONICALLY. YOU ALSO ACKNOWLEDGE THAT YOUR CONSENT TO ELECTRONIC DISCLOSURES IS REQUIRED TO RECEIVE CONSUMER FINANCIAL SERVICES FROM US OVER THE INTERNET.
                              <br /><br />
                              Print and retain a hard copy or electronic copy.
                              <br /><br />
                              <b>ELECTRONIC CONSENT AND ACKNOWLEDGMENT.</b> BY CLICKING THE &#34;I AGREE&#34; BUTTON, YOU CERTIFY THAT:<br />
                              <ul>
                                <li>Your computer hardware and software meet the requirements needed to access and retain the Documents electronically.</li>
                                <li>You consent to receive the Disclosures electronically.</li>
                                <li>You consent to sign your Loan Agreement and related documents electronically. You understand and agree that you will be bound to the same terms and conditions if you sign the Documents electronically as if you signed paper Documents.</li>
                              </ul>
                            </PopoverCheckbox>
                            <PopoverCheckbox
                              label={['Terms of Use & Privacy Policy']}
                              name="ConsentElectronicCommunication"
                              onChange={this.handleCheckboxChange.bind(null, 'ConsentElectronicCommunication')}
                              isChecked={values.ConsentElectronicCommunication}
                              id="ConsentElectronicCommunication"
                              errorMessage={errors.ConsentElectronicCommunication}
                            >
                              By checking this box (1) you authorize LendingUSA.com to forward your application, including your nonpublic personal information, to other companies for consideration of your qualification for a loan product; (2) you consent that we may share the information you provide to us with other companies to receive products or services we believe may be of interest to you; and (3) you acknowledge you have reviewed our Privacy Policy which can found at <a href="http://www.lendingusa.com/privacy-policy" target="_blank" rel="noopener noreferrer">http://www.lendingusa.com/privacy-policy</a> (4) you acknowledge you have reviewed and agreed to our Terms of Use which can be found at <a href="http://www.lendingusa.com/terms-of-use" target="_blank" rel="noopener noreferrer">http://www.lendingusa.com/terms-of-use</a>
                              <br /><br />
                              Electronic Signature Agreement. By selecting the &quot;CHECK MY RATE&quot; button, you are signing this Agreement electronically. You agree your electronic signature is the legal equivalent of your manual signature on this Agreement. By selecting &quot;CHECK MY RATE&quot; you consent to be legally bound by this Agreement&#39;s terms and conditions. You further agree that your use of a key pad, mouse or other device to select an item, button, icon or similar act/action, or to otherwise provide LendingUSA.com, or in accessing or making any transaction regarding any agreement, acknowledgment, consent terms, disclosures or conditions constitutes your signature (hereafter referred to as &quot;E-Signature&quot;), acceptance and agreement as if actually signed by you in writing. You also agree that no certification authority or other third party verification is necessary to validate your E-Signature and that the lack of such certification or third party verification will not in any way affect the enforceability of your E-Signature or any resulting contract between you and LendingUSA.com. You also represent that you are authorized to enter into this Agreement for all persons who own or are authorized to access any of your accounts and that such persons will be bound by the terms of this Agreement. You further agree that each use of your E-Signature in obtaining a LendingUSA.com service constitutes your agreement to be bound by the terms and conditions of the LendingUSA.com Disclosures and Agreements as they exist on the date of your E-Signature.

                            </PopoverCheckbox>
                            <PopoverCheckbox
                              label={['Request for Credit']}
                              name="ConsentToCredit"
                              onChange={this.handleCheckboxChange.bind(null, 'ConsentToCredit')}
                              isChecked={values.ConsentToCredit}
                              id="ConsentToCredit"
                              errorMessage={errors.ConsentToCredit}
                            >
                              The Applicant/Additional Applicant hereby acknowledges and recognizes that this is an application for credit. By submitting this application, I (We) have verified that all information submitted on this application is true and accurate to the best of our knowledge, as well as allowing LendingUSA.com, and/or its Lender(s) and other 3rd Parties to verify the enclosed information, including, but not limited to, obtaining our credit reports, contacting our employers to verify employment and income, and/or contacting our Provider/Merchant to verify the type of procedure(s) and/or service(s) and/or product(s), procedure and/or service date, deposit amount, procedure and/or service and/or product amount, and remit payment upon approval. You authorize LendingUSA.com, and/or its Lender(s) and other 3rd Parties to verify the enclosed information and to obtain consumer reports each time you request a loan, during the processing or closing of a loan to you, or at various times during the term of your loan in connection with the servicing, monitoring, collection or enforcement of the loan or the resale or potential resale of the loan. I (We) understand and agree that the Lender(s) [as defined in the Promissory Note or communicated to me] can furnish information concerning my/our account to consumer reporting agencies and others who may properly receive that information. By providing a telephone number for a cellular phone or other wireless device, I (We) are expressly consenting to receiving communications at that number, including, but not limited to, prerecorded voice message calls, text messages, and calls made by any representatives from LendingUSA.com and/or its Lender(s) and other 3rd Parties. This express consent applies to each such telephone number that I (We) provide to LendingUSA.com and/or its Lender(s) now or in the future and permits such calls regardless of their purpose. These calls and messages may incur access fees from my/our cellular provider. I (We) understand that we may opt out of this authorization by providing written notice to the parties herein. APR’s will vary depending upon credit ratings and/or payment terms that are approved. Credit approvals are valid for a limited time only. Certain fees may apply. By signing, I (We) certify that I (We) have read, agree to, and understand the disclosures herein and I (We) agree to the terms of this application and that a Provider/Merchant staff member may apply on our behalf.
                              <br /><br />
                              I hereby acknowledge that I am over the age of eighteen (18) years, and that I am U.S Citizen or U.S Permanent Resident, and that all the information set forth in this credit statement is true, accurate and complete full and complete disclosure thereof.
                            </PopoverCheckbox>
                          </Column>
                          <Column className="small-12 medium-9 padded-top padded-bottom">
                            <Input
                              label="Applicant E-Signature (Type full name)"
                              name="signatureBy.name"
                              value={values.signatureBy && values.signatureBy.name}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['signatureBy.name']}
                              onBlur={this.handleBlur}
                              errorMessage={errors['signatureBy.name']}
                            />
                          </Column>
                          <Column className="small-12 medium-3 padded-top padded-bottom">
                            <Input
                              name="signatureBy.date"
                              value={values.signatureBy && values.signatureBy.date}
                              label="Date"
                              className="current-date"
                              isDisabled
                            />
                          </Column>
                        </Grid>

                        <h5>Important information about procedures for opening a new account</h5>
                        <textarea className="no-resize" rows="3" readOnly defaultValue="To help the government fight the funding of terrorism and money laundering activities, federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account or applies for a loan from Cross River Bank (&ldquo;we&rdquo;). What this means for you: When you open an account or apply for a loan, we will ask for your name, address, date of birth and other information that will allow us to identify you. We may also ask to see your driver’s license or other identifying documents. If you fail to provide the required information, we may be unable to open an account or grant you a loan." />
                        <Button
                          className={cn('button large green w-100', style.button, isLoading ? '' : 'arrow')}
                          onClick={this.handleSubmitForm.bind(null, values)}
                          isDisabled={!(values.ConsentToForward && values.ConsentElectronicCommunication && values.ConsentToCredit)}
                          isLoading={isLoading}
                        >
                          Check My Rate
                        </Button>
                      </FormGroup>
                    </Column>
                  </Fragment>
                }

                <Sidebar bottomBoundary={2465} />
              </Grid>
            </div>
          </div>
        </section>
        <Footer />
      </form>
    );
  }
}

Application.propTypes = {
  className: PropTypes.string,
  validator: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  checkinAction: PropTypes.func.isRequired,
  // eslint-disable-next-line
  checkPreviousAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  getIPAddress: PropTypes.func.isRequired,
};

Application.defaultProps = {
  className: '',
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      getIPAddress,
      checkinAction,
      checkPreviousAction,
    }
  )
)(Application);
