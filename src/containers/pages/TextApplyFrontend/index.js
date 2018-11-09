import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';
import dateFns from 'date-fns';
import emailMask from 'text-mask-addons/dist/emailMask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import Validator from 'components/Validator/Validator';
import PageContent from 'components/Template/PageContent';
import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import FormGroup from 'components/Form/FormGroup';
import FormGroupLabel from 'components/FormGroupLabel';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import Checkbox from 'components/Form/Checkbox';
import { Button } from 'components/Button';

import {
  applyApplication,
} from 'actions/borrowerApply';

import schema from './schema';
import style from './style.scss';

const currencyMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  integerLimit: 5,
});

const unmask = val => val.replace(/[$, ]+/g, '');

class BorrowerApply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitted: false,
      // eslint-disable-next-line
      response: {},
      isLoading: false,
    };
  }

  getCurrentDate = () => dateFns.format(new Date(), 'MM/DD/YYYY');

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
    const { validator: { validate, values } } = this.props;
    if (validate(schema).isValid) {
      this.setState({
        isLoading: true,
      });
      const formData = {
        ...values,
        requestedAmount: unmask(values.requestedAmount),
        serviceAmount: unmask(values.serviceAmount),
        serviceDate: this.getCurrentDate(),
        merchantId: localStorage.getItem('merchantId'),
      };

      this.props.applyApplication({
        url: '/workflows/application/workflow/text2apply/start',
        data: formData,
        success: (response) => {
          this.setState({
            isSubmitted: true,
            // eslint-disable-next-line
            response: response,
            isLoading: false,
          });
        },
        fail: (error) => {
          console.log(error);
        },
      });
    }
    console.log(validate(schema));
  };

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  };

  handleCheckboxChange = (name, value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(name, value);
  };

  handleSliderChange = (value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler('requestedAmount', value);
  };

  render() {
    const { className, validator: { values, errors } } = this.props;
    const { isSubmitted, isLoading } = this.state;
    return (
      <form className={cn(style.App, className)} onSubmit={this.handleSubmitFrom.bind(null, values)}>
        <Header />
        <section className="grid-container fluid borrowers-apply section">
          <div className="grid-container">
            <div className="grid-x grid-margin-x max-limited">
              {
              isSubmitted ?
                <PageContent>
                  <Title>You have successfully sent text2apply link to applicant!</Title>
                </PageContent>
              :
                <Fragment>
                  <div className="cell small-12 form-headline">
                    <h2>Text to Apply Application</h2>
                  </div>

                  <div className="cell small-12 large-12 main-column">
                    <FormGroup className="form-group">
                      <FormGroupLabel value="Product/Service Information" />
                      <div className="grid-x grid-margin-x">
                        <div className="cell small-12 medium-6 large-4">
                          <Input
                            label="Total Amount of Service"
                            name="requestedAmount"
                            value={`${values.requestedAmount}`}
                            isMasked={currencyMask}
                            onChange={this.handleInputChange}
                            hasError={!!errors.requestedAmount}
                            isRequired
                            notification="Please enter the cost of services"
                          />
                        </div>
                        <div className="cell small-12 medium-6 large-4">
                          <Input
                            label="Total Amount Requested"
                            name="serviceAmount"
                            value={`${values.serviceAmount}`}
                            isMasked={currencyMask}
                            onChange={this.handleInputChange}
                            hasError={!!errors.serviceAmount}
                            isRequired
                            notification="Please enter the loan amount requested by the applicant"
                          />
                        </div>
                        <div className="cell small-12 medium-6 large-4">
                          <Input
                            name="serviceDate"
                            isMasked={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                            label="Date Of Service"
                            placeHolder="__/__/____"
                            value={this.getCurrentDate()}
                            onChange={this.handleInputChange}
                            hasError={!!errors.serviceDate}
                            tooltip="Please enter the date of service"
                            isDisabled
                          />
                        </div>
                      </div>
                    </FormGroup>

                    <div className="form-group">
                      <FormGroupLabel value="Applicant Personal Information" />
                      <div className="grid-x grid-margin-x">
                        <div className="cell small-12 medium-6 large-4">
                          <Input
                            label="First Name"
                            name="firstName"
                            value={values.firstName}
                            onChange={this.handleInputChange}
                            isRequired
                            hasError={!!errors.firstName}
                          />
                        </div>
                        <div className="cell small-12 medium-6 large-4">
                          <Input
                            label="Last Name"
                            name="lastName"
                            value={values.lastName}
                            onChange={this.handleInputChange}
                            isRequired
                            hasError={!!errors.lastName}
                          />
                        </div>
                        <div className="cell small-12 medium-6 large-4">
                          <Select
                            name="stateOfResidence"
                            data={[
                              { value: '', title: 'Select State ...' },
                              { value: 'AL', title: 'Alabama' },
                              { value: 'AK', title: 'Alaska' },
                              { value: 'AZ', title: 'Arizona' },
                              { value: 'AR', title: 'Arkansas' },
                              { value: 'CA', title: 'California' },
                              { value: 'CO', title: 'Colorado' },
                              { value: 'DE', title: 'Delaware' },
                              { value: 'FL', title: 'Florida' },
                              { value: 'GA', title: 'Georgia' },
                              { value: 'HI', title: 'Hawaii' },
                              { value: 'ID', title: 'Idaho' },
                              { value: 'KS', title: 'Kansas' },
                              { value: 'KY', title: 'Kentucky' },
                              { value: 'LA', title: 'Louisiana' },
                              { value: 'MD', title: 'Maryland' },
                              { value: 'ME', title: 'Maine' },
                              { value: 'MA', title: 'Massachusetts' },
                              { value: 'MI', title: 'Michigan' },
                              { value: 'MN', title: 'Minnesota' },
                              { value: 'MS', title: 'Mississippi' },
                              { value: 'MO', title: 'Missouri' },
                              { value: 'MT', title: 'Montana' },
                              { value: 'NE', title: 'Nebraska' },
                              { value: 'NV', title: 'Nevada' },
                              { value: 'NJ', title: 'New Jersey' },
                              { value: 'NM', title: 'New Mexico' },
                              { value: 'OH', title: 'Ohio' },
                              { value: 'OK', title: 'Oklahoma' },
                              { value: 'OR', title: 'Oregon' },
                              { value: 'PA', title: 'Pennsylvania' },
                              { value: 'RI', title: 'Rhode Island' },
                              { value: 'SC', title: 'South Carolina' },
                              { value: 'SD', title: 'South Dakota' },
                              { value: 'TN', title: 'Tennessee' },
                              { value: 'TX', title: 'Texas' },
                              { value: 'UT', title: 'Utah' },
                              { value: 'VA', title: 'Virginia' },
                              { value: 'WA', title: 'Washington' },
                              { value: 'WI', title: 'Wisconsin' },
                              { value: 'WY', title: 'Wyoming' },
                              { value: 'AA', title: 'Armed Forces - Americas' },
                              { value: 'AE', title: 'Armed Forces - Europe' },
                              { value: 'AP', title: 'Armed Forces - Pacific' },
                              { value: 'DC', title: 'District of Columbia' },
                            ]}
                            value={values.stateOfResidence}
                            onChange={this.handleInputChange}
                            label="State of Residence"
                            isRequired
                            hasError={!!errors.stateOfResidence}
                          />
                        </div>
                        <div className="cell small-12 medium-6 large-4">
                          <Input
                            label="Email Address"
                            name="email"
                            isMasked={emailMask}
                            placeHolder="Email address"
                            value={values.email}
                            onChange={this.handleInputChange}
                            isRequired
                            hasError={!!errors.email}
                          />
                        </div>
                        <div className="cell small-12 medium-6 large-4">
                          <Input
                            label="Mobile Phone Number"
                            name="phoneNumber"
                            placeHolder="(___) ___-____"
                            isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                            value={values.phoneNumber}
                            onChange={this.handleInputChange}
                            isRequired
                            hasError={!!errors.phoneNumber}
                          />
                        </div>
                        <div className="cell small-12 checkbox-row padded-bottom">
                          <Checkbox
                            label={['I hereby certify that the applicant provided permission to send this application via text message']}
                            name="hasApplicationConsented"
                            onChange={this.handleCheckboxChange.bind(null, 'hasApplicationConsented')}
                            isChecked={values.hasApplicationConsented}
                            id="hasApplicationConsented"
                            errorMessage={errors.hasApplicationConsented}
                          />
                        </div>
                      </div>
                      <div className="grid-x grid-margin-x">
                        <div className="cell small-12 form-action-row">
                          <div className="grid-x grid-margin-x">
                            <div className="cell small-12 large-4 large-offset-4">
                              <Button
                                className={cn('button large arrow green w-100', style.button)}
                                onClick={this.handleSubmitFrom.bind(null, values)}
                                isLoading={isLoading}
                              >
                                Send Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              }

            </div>
          </div>
        </section>
        <Footer />
      </form>
    );
  }
}

BorrowerApply.propTypes = {
  className: PropTypes.string,
  validator: PropTypes.object.isRequired,
  applyApplication: PropTypes.func.isRequired,
};

BorrowerApply.defaultProps = {
  className: '',
};

export default compose(
  withRouter,
  Validator(schema),
  connect(
    null,
    {
      applyApplication,
    }
  )
)(BorrowerApply);

