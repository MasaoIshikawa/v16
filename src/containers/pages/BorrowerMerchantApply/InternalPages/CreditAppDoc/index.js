import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';

import Header from 'components/Header';
import Heading from 'components/Heading';
import Footer from 'components/Footer';
import get from 'lodash/get';
import style from './style.scss';

class CreditAppDoc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      response: {},
    };
    window.addEventListener('message', this.onMessageReceived, false);
  }

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow } = this.props;
    if (get(workflow, ['state', 'data']) === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    }
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  onMessageReceived = (event) => {
    const { data } = event;
    const { history } = this.props;
    const params = parseUrlParams(window.location.search);

    if (data.event === 'session_timeout') {
      history.push(`/applications/docusign/timeout?applicationId=${params.applicationId}`);
    } else if (data.docuSignComplete) {
      if (params.applicationId) {
        this.props.nextAction({
          data: {
            event: data.event,
            eid: data.eid,
            id: data.applicationId,
            error: false,
          },
          url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
          // eslint-disable-next-line
          success: (response) => {
            history.push(get(response, 'state.url'));
            console.log(response);
          },
          fail: (error) => {
            console.log(error);
          },
        });
      }
    }
  }

  toggleModal = () => {
    this.setState(({ isModalShown }) => ({ isModalShown: !isModalShown }));
  }

  handleCheckboxChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  }

  handleButtonClick = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.nextAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
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
    // eslint-disable-next-line
    const { className, history, workflow } = this.props;
    return (
      <Fragment>
        <Header />
        <section className="container section">
          <div className="grid-container fluid page-sign-loan">
            <div className="grid-x">
              <Heading
                heading="Sign Credit Loan Document"
                isCardVisible={false}
                className={cn('small-12 large-12', style.description)}
              />
              <div className={cn('cell small-12 large-12', style.description)}>
                <p>
                  <strong>No Interest on Principal Option Promotion -</strong> Your loan has a 6 month no interest on principal promotion included. This promotion can save you money if you pay off the principal amount of the loan in full within the first 6 months. During the 6 month promotional period you will be responsible for making all of your monthly payments and your loan will accrue interest on a monthly basis. If you pay off your loan within the promotional period, the monthly payments that you have made during this period, which includes accrued interest, will be deducted from the principal amount of the loan. See loan agreement for full details and disclosures.
                </p>
                <p>
                  <strong>APR - An Annual Percentage Rate (APR)</strong> is the annual rate charged for borrwer funds, inclusive of all fees and charges. LendingUSA calculates APR by combining the Interest Rate and Origination Fees to provide a simple yearly rate.
                </p>
                <p>
                  <strong>Interest Rate -</strong> The interest Rate is the percent of principal charged by the lender for the use of its funds.
                </p>
                <p>
                  <strong>Late Fee -</strong> LendingUSA believes that borrowers should not be penalized for simple mistakes or oversights, as such, our Late Fee is only $5.00 and will be assessed if you fail to make a payment within 16 days of its scheduled due date.
                </p>
                <p>Please call LendingUSA directly with any questions regarding the loan or its terms at <strong>800-944-6177</strong></p>
              </div>
              <div className="cell small-12 main-column">
                <iframe
                  src={get(workflow, ['state', 'data', 'url'])}
                  // src="http://localhost:3000/dashboard/borrowers-merchant/complete"
                  width="100%"
                  height="1200"
                  title="docusign"
                  id="docusign"
                  frameBorder="0"
                />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

CreditAppDoc.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

CreditAppDoc.defaultProps = {
  className: '',
};

export default connect(
  state => ({
    workflow: state.workflow,
  }),
  {
    nextAction,
  }
)(CreditAppDoc);
