import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Sticky from 'react-stickynode';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from 'actions/auth';

import { ButtonLink } from 'components/Button';
import style from './style.scss';

export class Header extends Component {
  state = {
    isMenuActive: false,
  }

  handleMenuHover = (e) => {
    e.preventDefault();

    this.setState({ isMenuActive: true });
  }

  handleMouseLeave = (e) => {
    e.preventDefault();

    this.setState({ isMenuActive: false });
  }

  handleClickButton = (url, e) => {
    e.preventDefault();
    const { history } = this.props;
    history.push(url);
  }

  render() {
    const { isMenuActive } = this.state;
    const { signOut: signOutAction } = this.props;

    return (
      <Sticky
        enabled
        innerZ={10000}
      >
        <header className="site-header" role="banner">
          <div className="site-navigation top-bar portal-bar" role="navigation" data-sticky data-options="marginTop:0;" data-top-anchor="1">
            <div className="top-bar-left">
              <div className="site-desktop-title top-bar-title">
                <Link to="/dashboard">LendingUSA</Link>
              </div>
            </div>
            {
              localStorage.idToken ?
                <Fragment>
                  <div className="top-bar-center show-for-large">
                    <ul className="menu">
                      <li className="menu-item">
                        <Link to="/dashboard">Dashboard</Link>
                      </li>
                      <li className="menu-item">
                        <Link to="/dashboard/application-review/action/AllApplications">Applications</Link>
                      </li>
                    </ul>
                    <div className="newsroom">
                      <span>Latest News</span>
                      <a href="#fef">New product release coming soon</a>
                    </div>
                  </div>
                  <div className="top-bar-right">
                    <ul className="dropdown menu desktop-menu cell shrink" data-dropdown-menu onMouseEnter={this.handleMenuHover} onMouseLeave={this.handleMouseLeave}>
                      <li className={cn('menu-item is-dropdown-submenu-parent opens-left', isMenuActive && 'is-active')}>
                        <a href="#fef">
                          <span>My Account</span>
                          {localStorage.getItem('idToken') && (localStorage.getItem('user.firstName') || localStorage.getItem('user.username'))}
                        </a>
                        <ul className={cn('menu vertical dropdown submenu is-dropdown-submenu first-sub', isMenuActive && 'js-dropdown-active')}>
                          <li className="is-submenu-item is-dropdown-submenu-item">
                            <ButtonLink
                              onClick={this.handleClickButton.bind(null, '/dashboard/profile')}
                              className={style.buttonLink}
                            >
                              Profile Settings
                            </ButtonLink>
                          </li>
                          <li className="is-submenu-item is-dropdown-submenu-item">
                            <ButtonLink
                              onClick={this.handleClickButton.bind(null, '/dashboard/funding-information')}
                              className={style.buttonLink}
                            >
                              Funding Information
                            </ButtonLink>
                          </li>
                          <li className="is-submenu-item is-dropdown-submenu-item">
                            <ButtonLink onClick={signOutAction} className={style.buttonLink}>Logout</ButtonLink>
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <a href="tel:+18009946177" className="phone"><span>Questions?</span> 800-994-6177</a>
                  </div>
                </Fragment>
              :
                <a href="tel:+18009946177" className="phone"><span>Questions?</span> 800-994-6177</a>
            }
          </div>
        </header>
      </Sticky>
      // <!-- End Portal Header -->
      // End Global Header
    );
  }
}

Header.propTypes = {
  signOut: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  connect(
    null,
    {
      signOut,
    }
  )
)(Header);
