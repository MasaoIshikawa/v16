import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import Loading from 'react-loading-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Header from 'components/Header';
import Footer from 'components/Footer';
import { Button } from 'components/Button';
import Select from 'components/Form/Select';

import style from './style.scss';

import {
  getBanners,
} from 'actions/banners';

const SELECT_ALL = '_all';

class WebBanners extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isModalShowing: false,
      banners: [],
      sizes: [
        {
          value: SELECT_ALL,
          title: 'Filter by Size...',
        },
        {
          value: '300x250',
          title: '300x250',
          css: 'size-1',
        },
        {
          value: '160x600',
          title: '160x600',
          css: 'size-2',
        },
        {
          value: '728x90',
          title: '728x90',
          css: 'size-3',
        },
      ],
      selectedBanner: SELECT_ALL,
      selectedSize: SELECT_ALL,
      selectedEmbeded: {},
    };
  }
  componentDidMount() {
    this.props.getBanners({
      url: 'lookup/merchant-banners',
      success: (res) => {
        const banners = [];
        Object.keys(res).forEach((key) => {
          banners.push({
            code: res[key].code,
            label: res[key].label,
            attributes: res[key].attributes,
          });
        });
        this.setState({
          loading: false,
          banners,
        });
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }
  handleButtonClick = (e, size) => {
    e.preventDefault();

    this.setState({
      isModalShowing: true,
      selectedEmbeded: size,
    });
  }
  handleCloseClick = (e) => {
    e.preventDefault();

    this.setState({
      isModalShowing: false,
    });
  }
  handleBannerChange = (event) => {
    this.setState({
      selectedBanner: event.target.value,
    });
  }
  handleSizeChange = (event) => {
    this.setState({
      selectedSize: event.target.value,
    });
  }
  render() {
    const { loading, isModalShowing, banners, selectedBanner, sizes, selectedSize, selectedEmbeded } = this.state;
    const merchantId = localStorage.getItem('merchantId');
    const contentMarkup = selectedEmbeded.markup ? selectedEmbeded.markup.replace(/{{merchantId}}/g, merchantId) : '<div/>';
    const optionsBanner = [{ value: SELECT_ALL, title: 'Select a Specialty' }];
    const content = banners.map((banner, index) => {
      // get options
      optionsBanner.push({
        value: banner.code,
        title: banner.label,
      });

      // get html content
      if (banner.code === selectedBanner || selectedBanner === SELECT_ALL) {
        const contentSizes = banner.attributes.sizes.map((bsize, sindex) => {
          if (bsize.size === selectedSize || selectedSize === SELECT_ALL) {
            // eslint-disable-next-line prefer-destructuring
            const found = sizes.filter(s => s.value === bsize.size)[0];
            const cssSize = found ? found.css : 'size-1';
            return (
              <div key={sindex} className="cell small-12 large-4">
                <div className="grid-x grid-margin-x">
                  <div className="cell small-6">
                    <img className={`banner-img ${cssSize}`} src={bsize.imageUrl} alt="Banner" />
                  </div>
                  <div className="cell small-6 action">
                    <h6>{bsize.size}</h6>
                    <Button
                      className={cn('button small green', style.button)}
                      onClick={e => this.handleButtonClick(e, bsize)}
                    >
                      Embed Code
                    </Button>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        });
        return (
          <div key={index} className="card">
            <div className="card-header">
              <h5>{banner.label} &nbsp;–&nbsp; {banner.attributes.title}</h5>
            </div>
            <div className="grid-x card-grid">
              {contentSizes}
            </div>
          </div>
        );
      }
      return null;
    });

    return (
      <Fragment>
        <Header />
        <section className="container section">
          <div className="grid-container fluid portal page-web-banners">

            <div className="grid-x">
              <div className="cell small-12 card-grid-container">

                <div className={cn('grid-x grid-margin-x page-header', style.pageHeader)}>
                  <div className="cell small-12 large-6">
                    <h3>Get Website Banners</h3>
                  </div>
                  <div className="cell small-12 large-3">
                    <Select
                      name="banners"
                      data={optionsBanner}
                      value={selectedBanner}
                      onChange={this.handleBannerChange}
                      label=""
                      hasDefault={false}
                    />
                  </div>
                  <div className="cell small-12 large-3">
                    <Select
                      name="sizes"
                      data={sizes}
                      value={selectedSize}
                      onChange={this.handleSizeChange}
                      label=""
                      hasDefault={false}
                    />
                  </div>
                </div>
                { loading &&
                  <div style={{ margin: '20px' }}>
                    <Loading type="oval" width="100%" height={50} fill="#f44242" />
                  </div>
                }
                { !loading &&
                  content
                }
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <div className={cn('reveal-overlay', style.reveal)} style={{ display: isModalShowing ? 'flex' : 'none' }}>
          <div className={cn('reveal', style.insideReveal)} id="EmbedCodeModal" data-reveal="" data-close-on-click="true" data-animation-in="slide-in-up" data-animation-out="slide-out-down" role="dialog" aria-hidden="true" data-yeti-box="EmbedCodeModal" data-resize="EmbedCodeModal" data-e="stwa5w-e" tabIndex="-1" style={{ display: 'block', top: '136px' }} data-events="resize">
            <div className={cn('card-header', style.cardHeader)}>
              <h5>Embed Code</h5>
            </div>

            <div className="grid-x">
              <div className="cell small-12">
                <div className={cn('form-group', style.noBottom)}>
                  <div className="grid-x grid-margin-x">
                    <div className={cn('cell shrink', style.embedImage)}>
                      <img src={selectedEmbeded.imageUrl} alt="Banner" />
                    </div>
                    <div className="cell auto">
                      <label className="has-value"><span>HTML Embed Code</span>
                        <textarea value={contentMarkup} readOnly />
                      </label>
                      <CopyToClipboard text={contentMarkup}>
                        <button className={cn('button green w-100', style.noMarginBottom)}>Copy Code to Clipboard</button>
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="close-button" data-close="" aria-label="Close reveal" type="button" onClick={this.handleCloseClick}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

WebBanners.propTypes = {
  getBanners: PropTypes.func.isRequired,
};

WebBanners.defaultProps = {

};

export default connect(null, { getBanners })(WebBanners);
