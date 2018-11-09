import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import emailMask from 'text-mask-addons/dist/emailMask';

import Header from 'components/Header';
import Footer from 'components/Footer';

import brochureImage from 'assets/images/brochures.jpg';
import style from './style.scss';
import schema from './schema';
import dateFns from 'date-fns';

import Validator from 'components/Validator/Validator';
import { Button } from 'components/Button';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';

import {
  requestBrochureAction,
} from 'actions/brochure';

class RequestBrochures extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // isSubmitted: false,
      // eslint-disable-next-line
      response: {},
    };
  }

  componentWillMount() {
    const { validator: { setValues } } = this.props;
    const initialFormData = {
      businessName: localStorage.getItem('businessName') || 'default',
    };
    setValues(initialFormData);
  }

  getCurrentDate = () => dateFns.format(new Date(), 'MM/DD/YYYY');

  handleSubmitForm = (data, e) => {
    e.preventDefault();
    const { validator: { validate } } = this.props;
    if (validate(schema).isValid) {
      const formData = {
        ...data,
      };
      const merchantId = localStorage.getItem('merchantId');

      this.props.requestBrochureAction({
        data: formData,
        url: `/merchants/${merchantId}/brochures`,
        success: (response) => {
          // eslint-disable-next-line
          const { history } = this.props;
          this.setState({
            // isSubmitted: true,
            // eslint-disable-next-line
            response: response,
          });
          history.push('/dashboard');
        },
        fail: (error) => {
          console.log(error);
        },
      });
    } else {
      console.log('api error');
    }
  };

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  };

  render() {
    const { validator: { values, errors } } = this.props;
    return (
      <form className={cn(style.App)} onSubmit={this.handleSubmitForm.bind(null, values)}>
        <Fragment>
          <Header />
          <section className="container section">
            <div className="grid-container fluid portal page-brochures">
              <div className="grid-x">
                <div className="cell small-12 card-grid-container">
                  <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                    <div className="cell small-12">
                      <h3>Request Brochures</h3>
                    </div>
                  </div>
                  <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                    <div className="cell small-12">
                      <div className="card">
                        <div className="card-section">
                          <div className="grid-x grid-margin-x">
                            <div className="cell small-12 large-4 image">
                              <img src={brochureImage} alt="Request Brochures" />
                            </div>
                            <div className="cell small-12 large-8">
                              <h6>If you need to order new printed brochures for your office please complete the form below</h6>
                              <div className="grid-x grid-margin-x">
                                <div className="cell small-12 large-6">
                                  <Input
                                    label="Business Name"
                                    name="businessName"
                                    value={localStorage.getItem('businessName') || 'default'}
                                    readOnly
                                    isRequired
                                  />
                                  <Input
                                    label="Full Name"
                                    name="contactName"
                                    value={values.contactName}
                                    onChange={this.handleInputChange}
                                    isRequired
                                    hasError={!!errors.contactName}
                                  />
                                  <Input
                                    label="Phone Number"
                                    isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    placeHolder="(___) ___-____"
                                    name="phone"
                                    value={values.phone}
                                    onChange={this.handleInputChange}
                                    isRequired
                                    hasError={!!errors.phone}
                                  />
                                  <Input
                                    label="Email"
                                    name="email"
                                    isMasked={emailMask}
                                    placeHolder="Email address"
                                    value={values.email}
                                    onChange={this.handleInputChange}
                                    isRequired
                                    hasError={!!errors.email}
                                  />
                                </div>
                                <div className="cell small-12 large-6">
                                  <Input
                                    label="Street Address"
                                    name="address"
                                    value={values.address}
                                    onChange={this.handleInputChange}
                                    isRequired
                                    hasError={!!errors.address}
                                  />
                                  <Input
                                    label="City"
                                    name="city"
                                    value={values.city}
                                    onChange={this.handleInputChange}
                                    isRequired
                                    hasError={!!errors.city}
                                  />
                                  <div className="grid-x grid-margin-x">
                                    <div className="cell small-7">
                                      <Select
                                        name="state"
                                        data={[
                                          { value: 'alabama', title: 'Alabama' },
                                          { value: 'alaska', title: 'Alaska' },
                                          { value: 'arizona', title: 'Arizona' },
                                          { value: 'arkansas', title: 'Arkansas' },
                                          { value: 'california', title: 'California' },
                                          { value: 'colorado', title: 'Colorado' },
                                          { value: 'connecticut', title: 'Connecticut' },
                                          { value: 'delaware', title: 'Delaware' },
                                          { value: 'district-of-columbia', title: 'District of Columbia' },
                                          { value: 'florida', title: 'Florida' },
                                          { value: 'georgia', title: 'Georgia' },
                                          { value: 'hawaii', title: 'Hawaii' },
                                          { value: 'idaho', title: 'Idaho' },
                                          { value: 'illinois', title: 'Illinois' },
                                          { value: 'indiana', title: 'Indiana' },
                                          { value: 'iowa', title: 'Iowa' },
                                          { value: 'kansas', title: 'Kansas' },
                                          { value: 'kentucky', title: 'Kentucky' },
                                          { value: 'louisiana', title: 'Louisiana' },
                                          { value: 'maine', title: 'Maine' },
                                          { value: 'maryland', title: 'Maryland' },
                                          { value: 'massachusetts', title: 'Massachusetts' },
                                          { value: 'michigan', title: 'Michigan' },
                                          { value: 'minnesota', title: 'Minnesota' },
                                          { value: 'mississippi', title: 'Mississippi' },
                                          { value: 'missouri', title: 'Missouri' },
                                          { value: 'montana', title: 'Montana' },
                                          { value: 'nebraska', title: 'Nebraska' },
                                          { value: 'nevada', title: 'Nevada' },
                                          { value: 'new-hampshire', title: 'New Hampshire' },
                                          { value: 'new-jersey', title: 'New Jersey' },
                                          { value: 'new-mexico', title: 'New Mexico' },
                                          { value: 'new-york', title: 'New York' },
                                          { value: 'north-carolina', title: 'North Carolina' },
                                          { value: 'north-dakota', title: 'North Dakota' },
                                          { value: 'ohio', title: 'Ohio' },
                                          { value: 'oklahoma', title: 'Oklahoma' },
                                          { value: 'oregon', title: 'Oregon' },
                                          { value: 'pennsylvania', title: 'Pennsylvania' },
                                          { value: 'rhode-island', title: 'Rhode Island' },
                                          { value: 'south-carolina', title: 'South Carolina' },
                                          { value: 'south-dakota', title: 'South Dakota' },
                                          { value: 'tennessee', title: 'Tennessee' },
                                          { value: 'texas', title: 'Texas' },
                                          { value: 'utah', title: 'Utah' },
                                          { value: 'vermont', title: 'Vermont' },
                                          { value: 'virginia', title: 'Virginia' },
                                          { value: 'washington', title: 'Washington' },
                                          { value: 'west-virginia', title: 'West Virginia' },
                                          { value: 'wisconsin', title: 'Wisconsin' },
                                          { value: 'wyoming', title: 'Wyoming' },
                                        ]}
                                        value={values.state}
                                        onChange={this.handleInputChange}
                                        label="State"
                                        isRequired
                                        hasError={!!errors.state}
                                      />
                                    </div>
                                    <div className="cell small-5">
                                      <Input
                                        label="Zip"
                                        name="zip"
                                        isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/]}
                                        placeHolder="_____"
                                        value={values.zip}
                                        onChange={this.handleInputChange}
                                        isRequired
                                        hasError={!!errors.zip}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="cell small-12 padded-bottom">
                                <Button
                                  className={cn('button green large w-100')}
                                  onClick={this.handleSubmitForm.bind(null, values)}
                                >
                                  Request Brochures
                                </Button>
                              </div>
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
      </form>
    );
  }
}

RequestBrochures.propTypes = {
  validator: PropTypes.object.isRequired,
  requestBrochureAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

RequestBrochures.defaultProps = {

};
export default compose(
  Validator(schema),
  connect(
    null,
    {
      requestBrochureAction,
    }
  )
)(RequestBrochures);
