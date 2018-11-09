import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Button } from 'components/Button';
import { Grid, Column } from 'components/Layout';

import CircleDeclined from 'assets/icons/circle-declined.svg';
import { parseUrlParams } from 'utils/parseUrlParams';
import style from './style.scss';

class DocusignTimeout extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    this.props.history.replace(`/fsl/autopayelection?applicationId=${params.applicationId}`);
  };

  render() {
    const { className } = this.props;
    return (
      <Fragment>
        <Header />
        <section className="container">
          <div
            className={cn(
              'grid-container fluid',
              style['borrowers-message'],
              className
            )}
          >
            <div className="grid-container">
              <Grid className="grid-margin-x max-limited">
                <Column className="small-12 large-8 large-offset-2">
                  <img src={CircleDeclined} alt="circle declined" />
                  <h2>Signing document timed out</h2>
                  <Button
                    className={cn('button large red', style.button)}
                    onClick={this.handleButtonClick}
                  >
                    Click here to Esign the document
                  </Button>
                </Column>
              </Grid>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

DocusignTimeout.propTypes = {
  history: PropTypes.object.isRequired,
  className: PropTypes.string,
};

DocusignTimeout.defaultProps = {
  className: '',
};

export default connect(state => ({
  auth: state.auth,
}))(DocusignTimeout);
