import React from 'react';
import PropTypes from 'prop-types';

const FormGroupLabel = ({ value }) => (
  // FormGroupLabel
  <h4>{value}</h4>
  // End FormGroupLabel
);

FormGroupLabel.propTypes = {
  value: PropTypes.string.isRequired,
};
export default FormGroupLabel;
