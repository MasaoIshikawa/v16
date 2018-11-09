import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import SecurityLock from 'components/Icons/SecurityLock';

import digicert from 'assets/images/digicert.png';
import style from './style.scss';

const Heading = ({ heading, subHeading, className, isCardVisible }) => (
  // Heading
  <div className={`cell small-12 form-headline ${className}`}>
    <h2 className={style.heading}>{heading}</h2>
    <p className={cn('p-large', style.subHeading)}>{subHeading}</p>
    {
      isCardVisible &&
      <div className="grid-x security hide-for-large">
        <div className={cn('cell small-9 ssl', style.encryption)}>
          <SecurityLock width="28" className={style.securityLock} />
          <p className={cn('p-small', style.noBottomMargin)}><strong>128-bit SSL</strong> protection and strict encryption</p>
        </div>
        <div className="cell small-3 certificate">
          <img src={digicert} alt="" />
        </div>
      </div>
    }
  </div>
  // End Heading
);

Heading.propTypes = {
  heading: PropTypes.any,
  subHeading: PropTypes.string,
  className: PropTypes.string,
  isCardVisible: PropTypes.bool,
};

Heading.defaultProps = {
  heading: '',
  subHeading: '',
  className: 'medium-12',
  isCardVisible: false,
};

export default Heading;
