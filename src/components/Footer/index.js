import React from 'react';
import { Grid, Column } from 'components/Layout';
import cn from 'classnames';
import style from './style.scss';

const Footer = () => (
  // Global Footer
  <div id="Footer" className="footer-container footer-simple" data-sticky-footer>
    <div>
      <footer className="footer row">
        <div className={cn('footer-content', style.footerContent)} style={{ fontSize: '.8rem' }}>
          <p>All loans are made by Cross River Bank, a New Jersey State Chartered Bank. Member FDIC. Loan amounts range from $1,000 to $35,000. No loans are offered in Connecticut, New Hampshire, New York, Vermont, or West Virginia. The APR’s range from 16.39% APR to 29.99% APR. An origination fee of 8% is included in the principal loan amount that results in an APR up to 29.99%.</p>
          <p>*Your loan has a 6-month zero interest rate promotion included. This promotion can save you money if you pay off the principal amount of the loan in full within the first 6 months. During the 6-month promotional period you will be responsible for making all of your monthly payments and your loan will accrue interest on a monthly basis. If you pay off your loan within the promotional period, the monthly payments that you have made during this period, which includes accrued interest, will be deducted from the principal amount of the loan. The principal amount includes the 8% origination fee.</p>
          <p>† To check the rates you qualify for, LendingUSA does a soft credit pull that will not impact your credit score. However, if you choose to continue your application, your full credit report will be requested from one or more consumer reporting agencies, which is considered a hard credit pull.</p>
        </div>
        <Grid className={cn('legal', style.legal)}>
          <Column className={cn('medium-6 security', style.security)}>
            <img src="https://www.lendingusa.com/wp-content/themes/FoundationPress/src/assets/images/security/temp-security-logos.png" alt="Equal Housing Opportunity - Digicert" />
          </Column>
          <Column className={cn('medium-6 copyright', style.copyright)}>
            <div className="footer-copy"><p>Copyright © 2018. LendingUSA, LLC. All Rights Reserved.</p></div>
          </Column>
        </Grid>
      </footer>
    </div>
  </div>
  // End Global Footer
);

export default Footer;
