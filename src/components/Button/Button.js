import React from 'react';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import style from './style.scss';

export const Button = (props) => {
  const { children, modifier, className, isDisabled, isLoading, ...rest } = props;

  return (
    <button
      className={className}
      onClick={props.onClick}
      disabled={isDisabled || isLoading}
      {...rest}
    >
      {isLoading ? <div className={style.loadingWrapper}><ReactLoading width={24} height={24} /></div> : children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  modifier: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

Button.defaultProps = {
  className: '',
  modifier: 'primary',
  onClick: () => {},
  children: null,
  isLoading: false,
  isDisabled: false,
};

export default Button;
