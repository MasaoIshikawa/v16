import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
// import Input from 'components/Form/Input';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import Slider from 'components/Slider';
import style from './style.scss';

const currencyMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  integerLimit: 5,
});

const unmask = val => val.replace(/[$, ]+/g, '');

const loanAmountRequested = ({ amount, onChange }) => (
// LoanAmountRequested
  <Fragment>
    <h4>Loan Amount Requested</h4>
    <div className="grid-x grid-margin-x slider-cells">
      <div className="cell small-12 medium-8 padded-bottom">
        <Slider
          min={1000}
          max={35000}
          value={parseInt(amount, 10) || 1000}
          orientation="horizontal"
          step={100}
          labels={{
            1000: '$1k',
            10000: '$10k',
            20000: '$20k',
            30000: '$30k',
          }}
          format={value => `$ ${value.toLocaleString()}`}
          onChange={onChange}
        />
      </div>
      <div className="cell small-12 medium-4 padded-bottom">
        <label className={cn('has-value', style.label)}>
          <MaskedInput
            name="requestedAmount"
            mask={currencyMask}
            className={cn('form-control ui-input', style.input)}
            type="text"
            required="required"
            placeholder="Verifiable Annual Gross Income"
            value={amount}
            onChange={(e) => {
              if (unmask(e.target.value) <= 35000) {
                onChange(unmask(e.target.value));
              } else {
                onChange(unmask(amount));
              }
            }}
          />
        </label>
      </div>
    </div>
  </Fragment>
  // LoanAmountRequested
);

loanAmountRequested.propTypes = {
  amount: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onChange: PropTypes.func.isRequired,
};

loanAmountRequested.defaultProps = {
  amount: 2220,
};

export default loanAmountRequested;
