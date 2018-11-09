import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import cn from 'classnames';
import {
  CognitoUserPool,
  CognitoUser,
} from 'amazon-cognito-identity-js';

import Header from 'components/Header';
import Footer from 'components/Footer';
import FormGroup from 'components/Form/FormGroup';
import FormGroupLabel from 'components/FormGroupLabel';
import { Grid, Column } from 'components/Layout';
import Input from 'components/Form/Input';
import Validator from 'components/Validator/Validator';
import { Button } from 'components/Button';
import { appConfig } from 'config/appConfig';

import schema from './forgotSchema';
import style from './style.scss';

class Forgot extends Component {
  state = {
    redirectToReferrer: false,
    error: '',
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  };

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
    const { validator: { validate }, history } = this.props;

    if (validate(schema).isValid) {
      const poolData = {
        UserPoolId: appConfig.userPoolId,
        ClientId: appConfig.clientId,
      };
      const userPool = new CognitoUserPool(poolData);

      const userData = {
        Username: data.username,
        Pool: userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.forgotPassword({
        onSuccess: (result) => { // eslint-disable-line
          history.push('/');
        },
        onFailure: (err) => {
          this.setState({
            error: err.message,
          });
        },
        inputVerificationCode() {
          const verificationCode = prompt('Please input verification code ', '');
          const newPassword = prompt('Enter new password ', '');
          cognitoUser.confirmPassword(verificationCode, newPassword, this);
        },
      });
    } else {
      console.log('api error');
    }

    // this.props.signIn({
    //   data: formData,
    //   // eslint-disable-next-line
    //   success: (res) => {
    //     this.setState({ redirectToReferrer: true });
    //   },
    //   fail: (res) => {
    //     if (res.code === 'UserNotFoundException') {
    //       this.notification.addNotification({
    //         message: res.message,
    //         level: 'error',
    //         position: 'tc',
    //       });
    //     } else if (res.code === 'NotAuthorizedException') {
    //       this.notification.addNotification({
    //         message: res.message,
    //         level: 'error',
    //         position: 'tc',
    //       });
    //     }
    //   },
    // });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { validator: { values, errors } } = this.props;
    const { error, redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <Fragment>
        <Header />
        <form onSubmit={this.handleSubmitFrom}>
          <section className={cn('grid-container fluid borrowers-apply section', style.loginContainer)}>
            <div className={cn('grid-container', style.innerLogin)}>
              <Grid className="grid-margin-x max-limited">
                <Column className="small-12 large-12">
                  <FormGroup className="form-group">
                    <Grid className="grid-margin-x">
                      <Column className="small-12 medium-12">
                        <FormGroupLabel value="Reset Password" />
                        <label className={style.error}>{error}</label>
                        <Grid className="grid-margin-x">
                          <Column className="small-12 medium-12">
                            <Input
                              name="username"
                              label="Username"
                              onChange={this.handleInputChange}
                              value={values.username}
                              hasError={!!errors.username}
                              hasValue
                              placeHolder="username"
                              isBadgeVisible={false}
                              isRequired
                            />
                          </Column>
                          <Column className="small-12 medium-12">
                            <Button
                              className={cn('button small green w-100', style.button)}
                              onClick={this.handleSubmitFrom.bind(null, values)}
                            >
                              Rest Password
                            </Button>
                          </Column>
                        </Grid>
                      </Column>
                    </Grid>
                  </FormGroup>
                </Column>
              </Grid>
            </div>
          </section>
        </form>
        <Footer />
      </Fragment>
    );
  }
}

Forgot.propTypes = {
  validator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  Validator(schema),
  connect(state => ({
    auth: state.auth,
  }))
)(Forgot);
