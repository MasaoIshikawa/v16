import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button } from 'components/Button';

import style from './style.scss';

const Card = ({ title, className, isSectionWrapped, isEditable, children }) => (
  // FormGroupLabel
  <div className={cn('card', isEditable && 'card-editable', style.card, className)}>
    <div className="card-header">
      <h5>{title}</h5>
      { isEditable && <Button className="button green hide save-btn">Save Changes</Button> }
    </div>
    {
      isSectionWrapped ?
        <div className="card-section">
          {children}
        </div>
      :
        children
    }
  </div>
  // End FormGroupLabel
);

Card.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  isSectionWrapped: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isEditable: PropTypes.bool,
};

Card.defaultProps = {
  className: '',
  isSectionWrapped: false,
  isEditable: false,
};

export default Card;
