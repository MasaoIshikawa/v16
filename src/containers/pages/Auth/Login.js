import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import cn from 'classnames';
import NotificationSystem from 'react-notification-system';

import { signIn } from 'actions/auth';
import Header from 'components/Header';
import Footer from 'components/Footer';
import FormGroup from 'components/Form/FormGroup';
import FormGroupLabel from 'components/FormGroupLabel';
import { Grid, Column } from 'components/Layout';
import Input from 'components/Form/Input';
import Validator from 'components/Validator/Validator';
import { Button, ButtonLink } from 'components/Button';

import schema from './loginSchema';
import style from './style.scss';

class Login extends Component {
  state = {
    redirectToReferrer: false,
    error: '',
    isLoading: false,
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  };

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
    const { validator: { validate } } = this.props;

    if (validate(schema).isValid) {
      const formData = data;
      this.setState({
        isLoading: true,
      });
      this.props.signIn({
        data: formData,
        // eslint-disable-next-line
        success: (res) => {
          this.setState({
            redirectToReferrer: true,
            isLoading: true,
          });
        },
        fail: (res) => {
          if (res.code === 'UserNotFoundException') {
            this.setState({
              isLoading: false,
            });
            this.notification.addNotification({
              message: res.message,
              level: 'error',
              position: 'tc',
            });
          } else if (res.code === 'NotAuthorizedException') {
            this.setState({
              isLoading: false,
            });
            this.notification.addNotification({
              message: res.message,
              level: 'error',
              position: 'tc',
            });
          } else {
            this.setState({
              error: res,
              isLoading: false,
            });
          }
        },
      });
    } else {
      console.log('api error');
    }
  };

  forgotPassworrd = () => {
    this.props.history.push('/forgot');
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { validator: { values, errors } } = this.props;
    const { error, redirectToReferrer, isLoading } = this.state;

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
                <Column className="small-12 large-12 main-column">
                  <NotificationSystem ref={(item) => { this.notification = item; }} />
                  <FormGroup className="form-group">
                    <Grid className="grid-margin-x">
                      <Column className="small-12 medium-10 medium-offset-1">
                        <FormGroupLabel value="Login" />
                        <Grid className={cn('grid-margin-x', style.relativeWrapper)}>
                          <Column className="small-12 medium-12">
                            <Input
                              name="username"
                              label="Username"
                              value={values.username}
                              onChange={this.handleInputChange}
                              hasError={!!errors.username}
                              hasValue
                              placeHolder="username"
                              isBadgeVisible={false}
                              isRequired
                            />
                          </Column>
                          <Column className="small-12 medium-12">
                            <Input
                              name="password"
                              type="password"
                              label="Password"
                              value={values.password}
                              onChange={this.handleInputChange}
                              hasError={!!errors['channel.attributes.serviceProvider.name']}
                              hasValue
                              placeHolder="password"
                              isBadgeVisible={false}
                              isRequired
                            />
                          </Column>
                          <Column className="small-12 medium-12">
                            <Button
                              className={cn('button small green w-100', style.button)}
                              onClick={this.handleSubmitFrom.bind(null, values)}
                              isLoading={isLoading}
                            >
                              Login
                            </Button>
                            <Column className={cn('small-12 medium-12', style.forgotPassword)}>
                              <ButtonLink onClick={this.forgotPassworrd}>Forgot password?</ButtonLink>
                            </Column>
                          </Column>
                          <label className={style.error}>{error}</label>
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

Login.propTypes = {
  validator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      signIn,
    }
  )
)(Login);
