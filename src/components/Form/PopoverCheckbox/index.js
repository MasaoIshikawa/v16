import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Popover, Overlay } from 'react-bootstrap';
import cn from 'classnames';

import { Button } from 'components/Button';
import style from './style.scss';

class PopoverCheckbox extends Component {
  state = {
    show: false,
    isButtonDisabled: true,
  };

  handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.getBoundingClientRect().height + 50;
    if (bottom) {
      this.setState({
        isButtonDisabled: false,
      });
    }
  }

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
      <div className={style.scrollBar} onScroll={this.handleScroll}>
        {children}
      </div>
      <div className="small-12" style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          className={cn('button small green', style.button)}
          onClick={this.handleAcceptButton}
          isDisabled={this.props.isButtonDisabled && this.state.isButtonDisabled}
        >
          I Agree
        </Button>
      </div>
    </Popover>
  );

  render() {
    // eslint-disable-next-line
    const { isChecked, className, errorMessage, isDisabled, type, label, name, id, value, children, ...rest } = this.props;
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
          <input
            className={style.input}
            type={type}
            name={name}
            onChange={this.handleChange}
            checked={isChecked}
            id={id}
          />
          <label className={cn(className, style.label)} htmlFor={id}>
            {label.map((item, index) => <Fragment key={index}>{item}</Fragment>)}
          </label>
        </div>
        {!!errorMessage && <div className={style.error}>{errorMessage}</div> }
      </div>
    );
  }
}

PopoverCheckbox.propTypes = {
  onChange: PropTypes.func,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.array,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  isButtonDisabled: PropTypes.bool,
  title: PropTypes.string,
};

PopoverCheckbox.defaultProps = {
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

export default PopoverCheckbox;
