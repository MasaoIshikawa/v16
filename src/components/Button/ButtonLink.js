import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import style from './style.scss';

export const ButtonLink = ({ className, children, onClick, ...rest }) => (
  <div
    className={cn(style.button, className)}
    onClick={onClick}
    {...rest}
  >
    {children}
  </div>
);

ButtonLink.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

ButtonLink.defaultProps = {
  className: '',
  onClick: () => {},
  children: null,
};

export default ButtonLink;
