import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import style from './PageContent.scss';

const PageContent = ({ children }) => (
  <div className={cn(style.content, 'cell small-8 form-headline medium-8')}>
    <main className={style.main}>
      {children}
    </main>
  </div>
);

PageContent.propTypes = {
  children: PropTypes.node,
};

PageContent.defaultProps = {
  children: null,
};

export default PageContent;
