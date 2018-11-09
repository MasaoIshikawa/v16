import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Button } from 'components/Button';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import thumbup from 'assets/icons/thumbs-up.svg';

import style from './style.scss';

class Congratulations extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
    isLoading: false,
  };

  componentWillMount() {
    const { history } = this.props;
    const params = parseUrlParams(window.location.search);
    if (!params.applicationId) {
      history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    this.setState({ isLoading: true });
    if (params.applicationId) {
      this.props.nextAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          this.setState({ isLoading: false });
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        fail: (error) => {
          console.log(error);
        },
      });
    }
  }

  render() {
    const { className } = this.props;
    const { isLoading } = this.state;
    return (
      <form className={cn(style.App, className)} onSubmit={() => {}}>
        <Header />
        <section className={cn('grid-container fluid section', style['borrowers-message'])}>
          <div className="grid-container">
            <div className="grid-x grid-margin-x max-limited">
              <div className="cell small-12 large-8 large-offset-2">
                <img src={thumbup} alt="thumb up" />
                <h2 style={{ marginBottom: '20px', marginTop: '30px' }}>Congratulations!<br />Your Loan is Pre-Approved</h2>
                <p className="p-xlarge" style={{ marginBottom: '40px' }}>Please have your merchant proceed to the next step</p>
                {
                  localStorage.getItem('token') && (
                    <Button
                      className={cn('button large green', isLoading ? '' : 'arrow')}
                      onClick={this.handleButtonClick}
                      isLoading={isLoading}
                    >
                      Merchant Continue to Next Step
                    </Button>
                  )
                }
              </div>

            </div>
          </div>
        </section>
        <Footer />
      </form>
    );
  }
}

Congratulations.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

Congratulations.defaultProps = {
  className: '',
};

export default connect(
  state => ({
    auth: state.auth,
    workflow: state.workflow,
  }),
  {
    nextAction,
  }
)(Congratulations);
