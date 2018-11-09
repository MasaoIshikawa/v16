import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
// import get from 'lodash.get';

import style from './style.scss';

const unSupportedStates = {
  CT: 'Connecticut',
  NY: 'New York',
  WV: 'West Virginia',
  NH: 'New Hampshire',
  VT: 'Vermont',
  KS: 'Kansas',
  MS: 'Mississippi',
  SC: 'South Carolina',
  WA: 'Washington',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  VI: 'Virgin Islands',
  PR: 'Puerto Rico',
};

class Popup extends Component {
  render() {
    const { type, handleAbort, data } = this.props;
    return (
      <div className={style['smarty-ui']}>
        <div className={style['smarty-popup']}>
          <div className={cn(style['smarty-popup-header'], type === 1 && style['smarty-popup-missing-input-header'], (type === 2 || type === 3 || type === 4) && style['smarty-popup-invalid-header'])}>
            {type === 1 && 'You didn\'t enter enough information'}
            {type === 2 && 'You entered an unknown address'}
            {type === 3 && 'P.O Box address is not allowed'}
            {type === 4 && `Currently we do not accept loan applications for residents of the state of ${unSupportedStates[data.state]}`}
          </div>
          <div className={style['smarty-popup-typed-address']}>
            { type !== 4 && `${data.address || ''} ${data.city || ''} ${data.state || ''} ${data.zipcode || ''}`}
          </div>
          <div className={style['smarty-choice-alt']}>
            <div className={cn(style['smarty-choice'], style['smarty-choice-abort'], style['smarty-abort'])} onClick={handleAbort}>Go back</div>
          </div>
        </div>
      </div>
    );
  }
}

Popup.propTypes = {
  handleAbort: PropTypes.func.isRequired,
  type: PropTypes.number,
  data: PropTypes.object,
};

Popup.defaultProps = {
  type: null,
  data: null,
};

export default Popup;
