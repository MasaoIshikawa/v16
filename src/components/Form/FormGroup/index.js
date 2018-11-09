import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const FormGroup = ({ className, children, error }) => (
  <div className={cn(className)} data-error={error}>
    {children}
  </div>
);

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
};

FormGroup.defaultProps = {
  error: '',
  className: '',
};

export default FormGroup;
