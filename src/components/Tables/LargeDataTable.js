import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import {
  SortingState,
  GroupingState,
  IntegratedGrouping,
  FilteringState,
  RowDetailState,
} from '@devexpress/dx-react-grid';

import {
  Grid,
  Table,
  TableHeaderRow,
  TableGroupRow,
  TableFilterRow,
  TableRowDetail,
  Toolbar,
  GroupingPanel,
  DragDropProvider,
} from '@devexpress/dx-react-grid-bootstrap3';

import StringFilterHeaderCell from './StringFilterHeaderCell';
import { DateFilterHeaderCell } from './DateFilterHeaderCell';
import TagFilterHeaderCell from './TagFilterHeaderCell';
import TagIndicatorFilterHeaderCell from './TagIndicatorFilterHeaderCell';
import ButtonsCell from './ButtonsCell';
import { TagCell } from './TagCell';
import TagIndicatorCell from './TagIndicatorCell';
import { MultiLineTextCell } from './MultiLineTextCell';
import DataGridHeader from './DataGridHeader';
import DataGridFooter from './DataGridFooter';
import ReactLoading from 'react-loading';
import { appConfig } from 'config/appConfig';

import style from './style.scss';

export class LargeDataTable extends Component {
  constructor(props) {
    super(props);
    const keys = [];
    const filterValues = {};
    const tableColumnExtensions = [];
    const defaultSorting = {
      columnName: null,
      direction: 'asc',
    };
    let columnName = '';
    props.columns.forEach((column, index) => {
      const conditionIndex = (column.type === 'text' || column.type === 'multi-text' || column.type === 'tag' || column.type === 'tag-text') ? 1 : 0;
      if (column.type === 'tag' || column.type === 'tag-text') {
        columnName = column.name;
      }
      const key = {
        type: column.type,
        columnName: column.name,
        data: '',
        conditionIndex,
      };
      keys.push(key);
      if (props.tags && props.tags.length !== 0 && index === props.columns.length - 1) {
        const headerTagKey = {
          type: 'htag',
          columnName,
          data: '',
          conditionIndex: 1,
        };
        keys.push(headerTagKey);
      }
      filterValues[column.name] = '';
      if (column.width) {
        tableColumnExtensions.push({ columnName: column.name, width: column.width });
      }
    });
    this.state = {
      grouping: [],
      queries: {
        pageLength: appConfig.limit,
        pageOffset: 0,
        keys,
        sorting: props.defaultSorting ? props.defaultSorting[0] : defaultSorting,
      },
      filterValues,
      tableColumnExtensions,
    };
  }

  componentDidMount() {
    const { queries } = this.state;
    this.loadData(queries, true);
  }

  componentWillReceiveProps(nextProps) {
    const { pageOffset } = this.props;
    if (!_.isEqual(pageOffset, nextProps.pageOffset)) {
      const queries = _.extend({}, this.state.queries, { pageOffset: nextProps.pageOffset.offset });
      this.setState({ queries });
    }
  }

  setFilter(columnName, filterData) {
    const { filterValues } = this.state;
    const queries = _.extend({}, this.state.queries, { pageOffset: 0 });
    const index = this.getColumnIndex(columnName);
    queries.keys[index].data = filterData.data;
    queries.keys[index].conditionIndex = filterData.conditionIndex;
    filterValues[columnName] = filterData.data;
    this.setState({ queries, filterValues }, () => {
      this.loadData(queries);
    });
  }

  getColumnIndex(colurmName) {
    let index = -1;
    const { columns } = this.props;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].name === colurmName) {
        index = i;
        break;
      }
    }
    return index;
  }

  handlePageLengthChange = (event) => {
    const queries = _.extend({}, this.state.queries);
    queries.pageLength = event.target.value;
    this.setState({ queries }, () => {
      this.loadData(queries);
    });
  }

  handlePageOffsetChange = (selectData) => {
    const queries = _.extend({}, this.state.queries);
    queries.pageOffset = selectData.selected * queries.pageLength;
    this.setState({ queries }, () => {
      this.loadData(queries);
    });
  };

  changeSorting = (sorting) => {
    const queries = _.extend({}, this.state.queries);
    const sortingObj = {
      columnName: sorting[0].columnName,
      direction: sorting[0].direction,
    };
    queries.sorting = sortingObj;
    this.setState({ queries }, () => {
      this.loadData(queries);
    });
  }

  handleHeaderTagSelect = (activeTags) => {
    const queries = _.extend({}, this.state.queries);
    const { keys } = queries;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].type === 'htag') {
        keys[i].data = activeTags;
      }
    }
    queries.activeTags = activeTags;
    this.setState({ queries }, () => {
      this.loadData(queries, false, true);
    });
  }

  loadData(queries, isInitial = false, isHeaderTag = false) {
    const { onFilter } = this.props;
    onFilter(queries, isInitial, isHeaderTag);
  }

  rowDetailRender = ({ row }) => (
    <div style={{ padding: '2rem' }}>
      <Grid
        rows={row.detailRows}
        columns={this.props.detailColumns}
      >
        <Table
          columnExtensions={this.props.detailColumnExtensions}
        >
          <Table.Row onClick={(e) => { console.log(e); }} />
        </Table>
        <TableHeaderRow />
      </Grid>
    </div>
  );

  changeGrouping = (grouping) => {
    this.setState({ grouping });
  }

  // handleRowClick = (row, e) => {
  //   e.preventDefault();
  //   this.props.history.push(`/dashboard/application-detail/?applicationId=${row.applicationId}`);
  // }

  render() {
    const { width, queries: { pageLength, pageOffset, keys }, filterValues, tableColumnExtensions } = this.state;
    const { className, columns, defaultSorting, rows, rowCount, tags, hasDetailRows, hasGrouping, hasSorting, loading } = this.props;
    let showSortingControls = false;
    let allowDragging = false;
    if (hasGrouping && hasSorting) {
      allowDragging = true;
      showSortingControls = true;
    } else if (hasGrouping && !hasSorting) {
      allowDragging = true;
    } else if (!hasGrouping && hasSorting) {
      showSortingControls = true;
    }

    return (
      <Fragment>
        <div className={classNames(style['virtual-data-table'], className)}>
          <DataGridHeader
            tags={tags}
            pageLength={pageLength}
            onPageLengthChange={this.handlePageLengthChange}
            onTagSelected={this.handleHeaderTagSelect}
          />
          <Grid
            rows={rows}
            columns={columns}
          >
            {allowDragging && <DragDropProvider />}
            <SortingState onSortingChange={this.changeSorting} defaultSorting={defaultSorting} />
            {
              (hasGrouping) ?
                <GroupingState
                  grouping={this.state.grouping}
                  onGroupingChange={this.changeGrouping}
                /> :
                null
            }
            {
              hasDetailRows &&
              <RowDetailState
                defaultExpandedRowIds={[]}
              />
            }
            { (hasGrouping) ? <IntegratedGrouping /> : null }
            <Table
              cellComponent={(props) => {
                const { row, column } = props;

                switch (column.type) {
                  case 'tag':
                    return <TagCell tags={row.tags} type={column.type} onClick={() => column.moreOptions.buttonClick()} />;
                  case 'tag-text':
                    return <TagCell tags={row.activity} type={column.type} onClick={() => column.moreOptions.buttonClick()} />;
                  case 'tag-indicator':
                    return <TagIndicatorCell name={column.name} title={column.title} style={column.moreOptions.style} info={row} />;
                  case 'buttons':
                    return (
                      <ButtonsCell
                        buttons={column.moreOptions.buttons}
                        info={row}
                        onClick={index => column.moreOptions.buttonClick(index, row)}
                      />
                    );
                  case 'multi-text':
                    return <MultiLineTextCell text={row.description} />;
                  case 'link':
                    return <td>{row.applicationId}</td>;
                  case 'status':
                    return <td><span className={classNames(style[`status-${row.statusCode}`], 'badge', style.status)}>{row.statusLabel}</span></td>;
                  default:
                    return <Table.Cell {...props} />;
                }
              }}
              // rowComponent={({ row, ...restProps }) => (
              //   <Table.Row
              //     {...restProps}
              //     // eslint-disable-next-line no-alert
              //     onClick={this.handleRowClick.bind(null, row)}
              //     style={{
              //       cursor: 'pointer',
              //     }}
              //   />
              // )}
              columnExtensions={tableColumnExtensions}
            />
            {/* <TableColumnReordering
              defaultOrder={['id', 'applicant', 'date', 'ssn', 'details']}
            /> */}
            <TableHeaderRow
              showSortingControls={showSortingControls}
              allowDragging={allowDragging}
              cellComponent={(props) => {
                const { column } = props;
                if (column.moreOptions && column.moreOptions.isEmptyHeader) {
                  return <td />;
                }
                return <TableHeaderRow.Cell {...props} showSortingControls />;
              }}
            />
            { (hasGrouping) ? <TableGroupRow /> : null }
            { (hasGrouping) ? <Toolbar /> : null }
            { (hasGrouping) ? <GroupingPanel allowDragging allowSorting /> : null }
            <FilteringState onFiltersChange={() => {}} />
            <TableFilterRow
              cellComponent={({ column }) => {
                let conditionIndex = 0;
                keys.forEach((item) => {
                  if (item.columnName === column.name) {
                    conditionIndex = item.conditionIndex;
                  }
                });
                if (column.type === 'text' || column.type === 'multi-text' || column.type === 'link' || column.type === 'status') {
                  return <StringFilterHeaderCell setFilter={filterData => this.setFilter(column.name, filterData)} value={filterValues[column.name]} conditionIndex={conditionIndex} />;
                } else if (column.type === 'date') {
                  return <DateFilterHeaderCell type={column.type} setFilter={filterData => this.setFilter(column.name, filterData)} value={filterValues[column.name]} conditionIndex={conditionIndex} />;
                } else if (column.type === 'tag' || column.type === 'tag-text') {
                  return <TagFilterHeaderCell setFilter={filterData => this.setFilter(column.name, filterData)} value={filterValues[column.name]} conditionIndex={conditionIndex} />;
                } else if (column.type === 'tag-indicator') {
                  return <TagIndicatorFilterHeaderCell />;
                }
                return null;
              }}
            />
            {
              hasDetailRows &&
              <TableRowDetail
                contentComponent={this.rowDetailRender}
              />
            }
          </Grid>
        </div>
        <DataGridFooter
          pageLength={pageLength}
          pageOffset={pageOffset}
          rowCount={rowCount}
          width={width}
          onPageLengthChange={this.handlePageLengthChange}
          onPageOffsetChange={this.handlePageOffsetChange}
        />
        {loading && <ReactLoading type="spin" />}
      </Fragment>
    );
  }
}

LargeDataTable.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array.isRequired,
  defaultSorting: PropTypes.array,
  detailColumnExtensions: PropTypes.array,
  detailColumns: PropTypes.array,
  rowCount: PropTypes.number.isRequired,
  rows: PropTypes.array.isRequired,
  tags: PropTypes.array,
  hasDetailRows: PropTypes.bool,
  hasGrouping: PropTypes.bool,
  hasSorting: PropTypes.bool,
  isLoading: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  loading: PropTypes.bool,
  menuFilter: PropTypes.string,
  onFilter: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  pageOffset: PropTypes.object,
};

LargeDataTable.defaultProps = {
  className: '',
  defaultSorting: [],
  detailColumns: null,
  detailColumnExtensions: null,
  tags: [],
  hasDetailRows: false,
  hasGrouping: false,
  hasSorting: false,
  isLoading: false,
  loading: false,
  menuFilter: '',
  pageOffset: null,
};

export default withRouter(LargeDataTable);
