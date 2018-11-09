import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Popover, Overlay } from 'react-bootstrap';
import cn from 'classnames';
import dateFns from 'date-fns';

import style from './style.scss';

class PopoverPopup extends Component {
  state = {
    show: false,
  };

  getCurrentDate = () => dateFns.format(new Date(), 'M/DD/YYYY');

  handleChange = (e) => {
    const { isChecked, onChange } = this.props;
    if (isChecked) {
      onChange(false);
    } else {
      this.setState({
        target: e.target,
        show: !this.state.show,
      });
    }
  }

  handleAcceptButton = (e) => {
    e.preventDefault();
    const { onChange, type, value, isChecked, isDisabled } = this.props;
    if (isDisabled) return false;

    onChange(type === 'checkbox' ? !isChecked : value);
    this.setState({
      show: false,
    });
  }

  popoverClick = (children, id) => (
    <Popover id={`${id}-wrapper`} className={style.popover} title={this.props.title}>
      <div className={style.scrollBar}>
        {children}
      </div>
    </Popover>
  );

  render() {
    // eslint-disable-next-line
    const { isChecked, className, errorMessage, type, label, name, id, value, children, ...rest } = this.props;
    const { show, target } = this.state;
    return (
      <div className={style.container}>
        <div className={style.checkbox}>
          <Overlay
            show={show}
            target={target}
            placement="top"
            containerPadding={20}
            rootClose
            onHide={() => { this.setState({ show: false }); }}
          >
            {this.popoverClick(children, id)}
          </Overlay>
          <label className={cn(className, style.label)} htmlFor={id} onClick={this.handleChange}>
            {label.map((item, index) => <Fragment key={index}>{item}</Fragment>)}
          </label>
        </div>
        {!!errorMessage && <div className={style.error}>{errorMessage}</div> }
      </div>
    );
  }
}

PopoverPopup.propTypes = {
  onChange: PropTypes.func,
  isChecked: PropTypes.bool,
  label: PropTypes.array,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  isButtonDisabled: PropTypes.bool,
  isDisabled: PropTypes.bool,
  title: PropTypes.string,
};

PopoverPopup.defaultProps = {
  onChange: () => {},
  isChecked: false,
  isDisabled: false,
  label: [],
  name: '',
  type: 'checkbox',
  value: 'on',
  className: '',
  errorMessage: '',
  isButtonDisabled: true,
  title: '',
};

export default PopoverPopup;
