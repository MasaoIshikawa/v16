import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Sticky from 'react-stickynode';

import IconLabel from 'components/IconLabel';
import Timer from 'components/Icons/Timer';
import Dollar from 'components/Icons/Dollar';
import Percent from 'components/Icons/Percent';
import SecurityLock from 'components/Icons/SecurityLock';
import digicert from 'assets/images/digicert.png';

import style from './style.scss';

const Sidebar = ({ bottomBoundary }) => (
  /* <!-- Apply Sidebar --> */
  <div id="Sidebar" className="cell large-4 sidebar-apply show-for-large" data-sticky-container>
    <Sticky
      enabled
      innerZ={9}
      top={120}
      bottomBoundary={bottomBoundary}
    >
      <div className="sticky" data-sticky data-top-anchor="Sidebar" data-btm-anchor="Footer" data-margin-top="7.5">
        <div className="card">
          <div className="card-section">
            <IconLabel
              icon={<Timer />}
              content={<Fragment><strong>Fast &amp; Easy Process</strong> with loan decisions in seconds</Fragment>}
            />
            <IconLabel
              icon={<Dollar />}
              content={<Fragment><strong>Fixed Rates</strong> and <strong>Low Monthly Payments</strong></Fragment>}
            />
            <IconLabel
              icon={<Percent />}
              content={<Fragment><strong>No Interest on Principal</strong> if paid in full within six months</Fragment>}
            />
          </div>
        </div>

        <div className="grid-x security">
          <div className={cn('cell small-9 ssl', style.encryption)}>
            <SecurityLock width="28" className={style.securityLock} />
            <p className={cn('p-small', style.noBottomMargin)}><strong>128-bit SSL</strong> protection and strict encryption</p>
          </div>
          <div className="cell small-3 certificate">
            <img src={digicert} alt="" />
          </div>
        </div>
      </div>
    </Sticky>
  </div>
);

Sidebar.propTypes = {
  bottomBoundary: PropTypes.any,
};

Sidebar.defaultProps = {
  bottomBoundary: '#footer',
};

export default Sidebar;
