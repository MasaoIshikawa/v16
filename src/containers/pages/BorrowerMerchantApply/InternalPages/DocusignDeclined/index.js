import React, { Component, Fragment } from 'react';
import cn from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Grid, Column } from 'components/Layout';

import { nextAction } from 'actions/workflow';

import CircleDeclined from 'assets/icons/circle-declined.svg';
import style from './style.scss';

class DocusignDeclined extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <section
          className={cn(
            'grid-container fluid section',
            style['borrowers-apply']
          )}
        >
          <div className="grid-container fluid borrowers-message">
            <div className="grid-container">
              <Grid className="grid-margin-x max-limited">
                <Column className="small-12 large-10 large-offset-1">
                  <img src={CircleDeclined} alt="circle declined" />
                  <h2>You have declined the offer</h2>
                  {/* <p className="p-xlarge">You will receive an adverse action notice within 30 days that will provide you with the specific reason(s) as to why we were unable to approve your application [{params.applicationId}].</p> */}
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

DocusignDeclined.propTypes = {
};

DocusignDeclined.defaultProps = {
};

export default compose(
  withRouter,
  connect(
    null,
    {
      nextAction,
    }
  )
)(DocusignDeclined);
