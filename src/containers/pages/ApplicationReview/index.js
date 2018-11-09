import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { map, findIndex, get } from 'lodash';
import ReactLoading from 'react-loading';

import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import Header from 'components/Header';
import Footer from 'components/Footer';
import LargeDataTable from 'components/Tables/LargeDataTable'; // eslint-disable-line
import { Button } from 'components/Button';

import {
  getApplications,
  getApplicationFilters,
} from 'actions/application';
import { appConfig } from 'config/appConfig';
import { formatCurrency } from 'utils/formatCurrency';

import style from './style.scss';

// eslint-disable-next-line
const initialFilter = {
  applicationId: '',
  applicationName: '',
  applicationDate: '',
  status: '',
  requestedAmount: '',
  purpose: '',
  merchant: '',
  assignedId: '',
  query: '',
  offset: 0,
  limit: appConfig.limit,
};

class ApplicationReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'applicationId', title: 'Application ID', type: 'link', width: 120 },
        { name: 'applicantName', title: 'Applicant', type: 'text' },
        { name: 'applicationDate', title: 'Submitted', type: 'date', width: 135 },
        { name: 'statusLabel', title: 'Status', type: 'status', width: 250 },
        { name: 'approvalAmount', title: 'Approval Amt', type: 'text', width: 150 },
        { name: 'amountFinanced', title: 'Amt Financed', type: 'text', width: 150 },
        { name: 'payoutPercentage', title: 'Payout %', type: 'text', width: 120 },
        { name: 'payoutAmount', title: 'Payout Amt', type: 'text', width: 150 },
        { name: 'fundedDate', title: 'Funded Date', type: 'date', width: 150 },
        { name: 'interestRate', title: 'Int Rate', type: 'text', width: 110 },
        { name: 'monthlyPayment', title: 'Monthly Payment', type: 'text', width: 150 },
        {
          name: '',
          title: '',
          type: 'buttons',
          moreOptions: {
            buttonClick: this.cellButtonHandler,
            buttons: [
              {
                title: 'Take Action',
                className: 'takeAction',
              },
            ],
          },
          width: 125,
        },
      ],
      loading: true,
      rowCount: 1,
      rows: [],
      tableKey: 'filterTable_default',
      selectedValue: null,
      searchValue: props.match.params.searchQuery,
      query: {
        sortBy: 'applicationDate',
        sortOrder: 'desc',
      },
      filterObj: {
        applicationId: '',
        applicationName: '',
        applicationDate: '',
        status: '',
        requestedAmount: '',
        purpose: '',
        merchant: '',
        assignedId: '',
        query: '',
        offset: 0,
        limit: appConfig.limit,
      },
      isLoaded: false,
    };
  }

  componentWillMount() {
    this.props.getApplicationFilters({
      url: 'filters/merchant-portal',
      success: (res) => {
        const selectedValueIndex = findIndex(get(res, 'filters.0.filters'), item => item.name === this.props.match.params.statusCode);
        this.setState({
          isLoaded: true,
          selectedValue: JSON.stringify(get(get(res, 'filters.0.filters'), `${selectedValueIndex}`)),
        });
      },
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown, false);
  }

  getParameter = (selectedValue, filterObj, searchValue, query = {}) => {
    const selectedQuery = get(selectedValue, 'attributes.query');
    const newQuery = { ...selectedQuery, ...query };
    delete newQuery.statusCode;
    delete newQuery.applicationDateOffsetEnd;
    const ret = {
      filter: get(selectedValue, 'attributes.query.statusCode'),
      applicationDateOffset: get(selectedValue, ['attributes', 'query', 'applicationDateOffsetEnd']),
      filterObj,
      search: searchValue,
      query: newQuery,
    };
    return ret;
  }

  // eslint-disable-next-line
  getApplications({
    filterObj = initialFilter,
    search = '',
    filter = null,
    query = { sortBy: 'applicationDate', sortOrder: 'desc' },
    applicationDateOffset = null,
  }) {
    const filters = [];
    filters[0] = (filterObj.applicationId !== '') ? `ApplicationId=${filterObj.applicationId}&` : '';
    filters[1] = (filterObj.applicationName !== '') ? `ApplicantName=${filterObj.applicationName}&` : '';
    filters[2] = (filterObj.applicationDate !== '') ? `ApplicationDate=${filterObj.applicationDate}&` : '';
    filters[3] = (filterObj.status !== '') ? `StatusLabel=${filterObj.status}&` : '';
    filters[4] = (filterObj.approvalAmount !== '') ? `ApprovalAmount=${filterObj.approvalAmount}&` : '';
    filters[5] = (filterObj.amountFinanced !== '') ? `AmountFinanced=${filterObj.amountFinanced}&` : '';
    filters[6] = (filterObj.payoutPercentage !== '') ? `PayoutPercentage=${filterObj.payoutPercentage}&` : '';
    filters[7] = (filterObj.payoutAmount !== '') ? `PayoutAmount=${filterObj.payoutAmount}&` : '';
    filters[8] = (filterObj.fundedDate !== '') ? `FundedDate=${filterObj.fundedDate}&` : '';
    filters[9] = (filterObj.interestRate !== '') ? `InterestRate=${filterObj.interestRate}&` : '';
    filters[10] = (filterObj.monthlyPayment !== '') ? `MonthlyPayment=${filterObj.monthlyPayment}&` : '';
    filters[11] = localStorage.getItem('merchantId') ? `merchantId=${localStorage.getItem('merchantId')}&` : `merchantId=${null}`;

    if (filter) {
      filters[12] = `statusCode=${filter}&`;
      // } else if (filter.value.assigned === 'true') {
      //   filters[7] = `assignedId=${localStorage.getItem('user.username')}&assigned=true&`;
      // } else if (filter.value.assigned === 'false') {
      //   filters[7] = 'assigned=false&';
      // }
    }
    filters[13] = query !== '' ? `${map(query, (value, key) => `${key}=${value}`).join('&')}&` : '';
    let terms = '';
    if (search !== '') { terms = `Terms=${search}&`; }
    if (applicationDateOffset && applicationDateOffset !== undefined) {
      filters[14] = `ApplicationDateOffsetEnd=${applicationDateOffset}&`;
      // } else if (filter.value.assigned === 'true') {
      //   filters[7] = `assignedId=${localStorage.getItem('user.username')}&assigned=true&`;
      // } else if (filter.value.assigned === 'false') {
      //   filters[7] = 'assigned=false&';
      // }
    }
    const url = `/applications-view/search?${filters.join('')}${terms}offset=${filterObj.offset}&limit=${filterObj.limit}&fields=data.applicationId,data.applicantName,data.applicationDate,data.statusAliases.merchantPortal,data.statusCode.merchantPortal,data.approvalAmount,data.amountFinanced,data.payoutPercentage,data.payoutAmount,data.interestRate,data.monthlyPayment,data.merchantId,data.fundedDate,pagination.*`;

    this.setState({ loading: true });
    this.props.getApplications({
      url,
      success: (res) => {
        const rows = res.data.map((item) => {
          const { applicationId, applicantName, applicationDate, statusAliases, statusCode, approvalAmount, amountFinanced, payoutPercentage, fundedDate, interestRate, payoutAmount, monthlyPayment } = item;

          return {
            applicationId,
            applicantName,
            applicationDate: format(new Date(applicationDate).toISOString(), 'M/DD/YYYY'),
            statusLabel: statusAliases.merchantPortal || '',
            approvalAmount: approvalAmount ? `$${formatCurrency(approvalAmount, 2)}` : '-',
            amountFinanced: amountFinanced ? `$${formatCurrency(amountFinanced, 2)}` : '-',
            payoutPercentage: payoutPercentage ? `${formatCurrency(payoutPercentage, 2)}%` : '-',
            payoutAmount: payoutAmount ? `$${formatCurrency(payoutAmount, 2)}` : '-',
            fundedDate: fundedDate ? format(new Date(fundedDate).toISOString(), 'M/DD/YYYY') : '-',
            interestRate: interestRate ? `${interestRate}%` : '-',
            monthlyPayment: monthlyPayment ? `$${formatCurrency(monthlyPayment, 2)}` : '-',
            statusCode,
            item,
          };
        });

        this.setState({
          rows,
          rowCount: res.pagination.total,
          loading: false,
        });
      },
      fail: (err) => {
        this.setState({ loading: false });

        if (err.response) {
          this.notificationSystem.addNotification({
            message: err.response.data.message,
            level: 'error',
            position: 'tc',
          });
        } else {
          console.log('Error', err);
        }
      },
    });
  }

  filterHandler = (queries) => {
    const { query, searchValue, selectedValue } = this.state;
    const filterObj = {
      applicationId: queries.keys[0].data,
      applicationName: queries.keys[1].data,
      applicationDate: queries.keys[2].data !== '' ? format(queries.keys[2].data.toISOString(), 'YYYY-MM-DD') : '',
      status: queries.keys[3].data,
      approvalAmount: queries.keys[4].data,
      amountFinanced: queries.keys[5].data,
      payoutPercentage: queries.keys[6].data,
      payoutAmount: queries.keys[7].data,
      fundedDate: queries.keys[8].data !== '' ? format(queries.keys[8].data.toISOString(), 'YYYY-MM-DD') : '',
      interestRate: queries.keys[9].data,
      monthlyPayment: queries.keys[10].data,
      offset: queries.pageOffset,
      limit: queries.pageLength,
    };
    const { sorting } = queries;

    query.sortBy = sorting.columnName;
    query.sortOrder = sorting.direction;

    const param = this.getParameter(JSON.parse(selectedValue), filterObj, searchValue, query);
    this.getApplications(param);
    this.setState({ filterObj });
  }

  handleKeydown = (event) => {
    if (event.keyCode === 13 && event.target.name === 'searchInput') {
      this.handleSearchClick(event);
    }
  }

  handleSearchClick = (e) => {
    e.preventDefault();
    const { searchValue, selectedValue } = this.state;
    this.setState(state => ({
      filterObj: {
        ...state.filterObj,
        offset: 0,
      },
    }), () => {
      const param = this.getParameter(JSON.parse(selectedValue), this.state.filterObj, searchValue);
      this.getApplications(param);
    });
  }

  handleFilterChange = (e) => {
    const { searchValue } = this.state;
    const selectedValue = e.target.value;
    this.setState(state => ({
      selectedValue,
      filterObj: {
        ...state.filterObj,
        offset: 0,
      },
    }), () => {
      const param = this.getParameter(JSON.parse(selectedValue), this.state.filterObj, searchValue);
      this.getApplications(param);
    });
  }

  handleReset = (e) => {
    e.preventDefault();

    this.setState({ selectedValue: null, searchValue: '' }, () => {
      this.handleSearchClick(e);
    });
  }

  handleChange = (e) => {
    e.preventDefault();

    this.setState({
      searchValue: e.target.value,
    });
  }

  // eslint-disable-next-line
  cellButtonHandler = (index, row) => {
    this.props.history.push(`/dashboard/application-detail?applicationId=${row.applicationId}`);
  }

  render() {
    // eslint-disable-next-line
    const { columns, loading, rows, rowCount, tableKey, selectedValue, query, searchValue, isLoaded, filterObj } = this.state;
    const { applications } = this.props;
    return (
      <Fragment>
        <Header />
        <section className="container">
          <div className="grid-container fluid portal page-applications">
            <div className="grid-x">
              <div className="cell small-12 card-grid-container">

                <div className={cn('grid-x grid-margin-x page-header', style.noTopMargin)}>
                  <div className="cell small-12 large-6">
                    <h3>Application Review</h3>
                  </div>
                  <div className="cell small-12 large-3">
                    <Select
                      name="form-field-name"
                      value={selectedValue}
                      onChange={this.handleFilterChange}
                      placeHolder="All Applications"
                      data={applications.filters && applications.filters.map(item => ({
                        value: JSON.stringify(item),
                        title: item.label,
                      }))}
                      hasDefault={false}
                    />
                  </div>
                  <div className="cell small-12 large-3 search-input">
                    <Input
                      onChange={this.handleChange}
                      placeHolder="Search"
                      value={searchValue}
                      name="searchInput"
                    />
                    <Button
                      className="button green arrow"
                      onClick={this.handleSearchClick}
                    />
                  </div>
                </div>

                <div className={cn('card', style.card)}>
                  <div className="card-header">
                    <h5>All Applications</h5>
                  </div>
                  {
                    isLoaded ?
                      <LargeDataTable
                        key={tableKey}
                        className="grid-x card-table"
                        columns={columns}
                        defaultSorting={[{ columnName: query.sortBy, direction: query.sortOrder }]}
                        pageOffset={{ offset: filterObj.offset, limit: filterObj.limit }}
                        hasGrouping
                        hasSorting
                        loading={loading}
                        rows={rows}
                        rowCount={rowCount}
                        onFilter={(queries, isInitial, isHeaderTag) => { this.filterHandler(queries, isInitial, isHeaderTag); }}
                      />
                    :
                      <div className={style.loadingHolder}>
                        <ReactLoading type="spin" color="#04bc6c" />
                      </div>
                  }
                </div>

              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

ApplicationReview.propTypes = {
  getApplications: PropTypes.func.isRequired,
  getApplicationFilters: PropTypes.func.isRequired,
  applications: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

ApplicationReview.defaultProps = {

};

const mapStateToProps = state => ({
  applications: state.applications,
  navigation: state.navigation,
});

const mapDispatchToProps = dispatch => ({
  getApplications: data => dispatch(getApplications(data)),
  getApplicationFilters: data => dispatch(getApplicationFilters(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ApplicationReview));
