import React from 'react';
import cn from 'classnames';
import ReactPaginate from 'react-paginate';

import style from './style.scss';
import prevImage from 'assets/icons/arrow-right-gray.svg';

type Props = {
  pageLength: number,
  pageOffset: number,
  rowCount: number,
  width: number,
  onPageLengthChange: () => {},
  onPageOffsetChange: () => {}
};

export default class DataGridFooter extends React.Component {
  props: Props;

  render() {
    const { pageLength, pageOffset, rowCount, width, onPageLengthChange, onPageOffsetChange } = this.props;
    let pageCount = 0;
    if (pageLength !== 0) {
      if (rowCount % pageLength === 0) {
        pageCount = parseInt(rowCount / pageLength, 10);
      } else {
        pageCount = parseInt(rowCount / pageLength, 10) + 1;
      }
    }
    const pageCountMark = (
      <div className="page-count-container">
        <div className="info-label">
          <div className="select-container">
            <select className="form-control" style={{ marginBottom: 0, padding: '0.5rem' }} value={pageLength} onChange={ev => onPageLengthChange(ev)}>
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
            <i className="fa fa-caret-down i-dropdown" />
          </div>
        </div>
        {/* <div className="info-label">Page size:&nbsp;</div> */}
      </div>
    );
    return (
      <div className={cn('card-footer', style['card-footer'])}>
        <div className="grid-x">
          <div className="cell small-3 pagination-label">{(pageOffset / pageLength) + 1}-{pageCount} of {rowCount} entries</div>
          <div className="cell small-6">
            <nav className="row">

              <ReactPaginate
                previousLabel={
                  <img src={prevImage} style={{ transform: 'rotate(180deg)' }} alt="prev" />
                }
                nextLabel={
                  <img src={prevImage} alt="next" />
                }
                breakLabel={<a href={window.location.href}>...</a>}
                breakClassName="break-me"
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={4}
                onPageChange={sd => onPageOffsetChange(sd)}
                containerClassName="pagination text-center"
                subContainerClassName="pages pagination"
                activeClassName="current"
                forcePage={pageOffset / pageLength}
              />
            </nav>
          </div>
          <div className="cell small-3">
            {
              (width < 1200) ? null : pageCountMark
            }
          </div>
        </div>
      </div>
    );
  }
}
