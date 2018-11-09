import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import style from './style.scss';

const Title = ({ className, children }) => (
  <h3 className={cn(className, style.container)}>
    {children}
  </h3>
);

Title.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Title.defaultProps = {
  children: null,
  className: '',
};

export default Title;
