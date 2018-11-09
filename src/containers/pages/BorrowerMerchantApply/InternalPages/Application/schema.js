import moment from 'moment';
import { numberUnmask, removeSpace } from 'utils/masks';
import { validateEmail } from 'utils/helper';
import get from 'lodash/get';

export default {
  'applicant.firstName': [{
    rule: 'required',
    isValid: (input) => {
      if (!input || removeSpace(input).length === 0) {
        return 'The input field is required';
      }
      return true;
    },
  }],
  'applicant.lastName': [{
    rule: 'required',
    isValid: (input) => {
      if (!input || removeSpace(input).length === 0) {
        return 'The input field is required';
      }
      return true;
    },
  }],
  'applicant.addresses.address': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'applicant.addresses.city': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'applicant.addresses.state': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'applicant.addresses.zipcode': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'applicant.dateOfBirth': [{
    rule: 'required',
    isValid: (input) => {
      if (!input) {
        return 'The input field is required';
      }

      if (numberUnmask(input).length < 8) {
        return 'Date of Birth is not valid';
      }

      if (!moment(input, 'MM/DD/YYYY').isValid()) {
        return 'Date of Birth is not valid';
      }
      return (moment.duration(moment(new Date()).diff(moment(input, 'MM-DD-YYYY'))).asYears()) < 18 ? 'Must be over 18 years old' : true;
    },
  }],
  'applicant.ssn': [
    {
      rule: 'required',
      isValid: (input) => {
        if (!input) {
          return 'The input field is required';
        }

        if (numberUnmask(input).length < 9) {
          return 'SSN is not valid';
        }

        const blockingSsns = [
          '078-05-1120',
          '219-09-9999',
          '111-11-1111',
          '222-22-2222',
          '333-33-3333',
          '444-44-4444',
          '555-55-5555',
          '666-66-6666',
          '777-77-7777',
          '888-88-8888',
          '999-99-9999',
          '123-45-6789',
        ];

        if (
          numberUnmask(input).substring(0, 3) === '000' ||
          numberUnmask(input).substring(3, 5) === '00' ||
          numberUnmask(input).substring(5, 9) === '0000' ||
          (Number(numberUnmask(input).substring(0, 3)) > 899 && Number(numberUnmask(input).substring(0, 3)) < 1000) ||
          blockingSsns.includes(input)

        ) {
          return 'SSN is not valid';
        }
      },
    },
  ],
  'applicant.email': [
    {
      rule: 'required',
      isValid: (input) => {
        if (!input) {
          return 'The input field is required';
        }

        const blokingEmails = [
          'none@none.com',
          'noemail@noemail.com',
          'noemail@gmail.com',
          'Noemail@email.com',
          'NONE@NOEMAIL.COM',
          'none@gmail.com',
          'none@yahoo.com',
          'no@no.com',
          'no@email.com',
          'noemail@yahoo.com',
          'test@test.com',
          'NA@NA.COM',
          'noname@gmail.com',
          'no@gmail.com',
          'noemail@mail.com',
          'test@email.com',
          'unknown@yahoo.com',
          'non@non.com',
          'NOEMAL@NOEMAIL.COM',
          'none@email.com',
          'noname@email.com',
          'noemail@no.com',
          'NON@NONE.COM',
          'EMAIL@EMAIL.COM',
          'nomail@gmail.com',
          'NOEMAIL@GIMAIL.COM',
          'NOEMAIL@AOL.COM',
          'na@gmail.com',
          'noemail@gmai.com',
          'Noemail@noemai.com',
          'none@aol.com',
        ];

        return (
          (blokingEmails.indexOf(input) !== -1) ||
          !validateEmail(input)
        ) ? 'Email is not valid' : true;
      },
    },
  ],
  'applicant.phoneNumbers.Number': [{
    rule: 'required',
    isValid: (input) => {
      const phoneNumbers = [
        '(111) 111-1111',
        '(222) 222-2222',
        '(333) 333-3333',
        '(444) 444-4444',
        '(555) 555-5555',
        '(666) 666-6666',
        '(777) 777-7777',
        '(999) 999-9999',
      ];

      const middleNumber = [
        800,
        866,
        888,
        900,
        911,
      ];

      if (!input) {
        return 'The input field is required';
      }

      return (
        numberUnmask(input).length < 10 ||
        phoneNumbers.indexOf(input || '') !== -1 ||
        (input && input.charAt(1) === '0') ||
        (input && input.charAt(1) === '1') ||
        (input && input.substring(6) === '000-0000') ||
        middleNumber.indexOf(Number((input && input.substring(6, 9)) || '')) !== -1
      ) ? 'Phone number is not valid' : true;
    },
  }],
  'financials.stated.grossMonthlyIncome': [{
    rule: 'required',
    isValid: (input) => {
      if (!input) {
        return 'The input field is required';
      }

      return (Number(numberUnmask(input)) > 41600 || Number(numberUnmask(input)) < 1) ? 'The amount you entered should not exceed $41,600.' : true;
    },
  }],
  'financials.stated.rentOrOwn': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'financials.stated.monthlyRentOrMortage': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'financials.stated.employmentStatus': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'financials.stated.employerName': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'financials.stated.employerPhone': [{
    rule: 'required',
    isValid: (input) => {
      const phoneNumbers = [
        '(111) 111-1111',
        '(222) 222-2222',
        '(333) 333-3333',
        '(444) 444-4444',
        '(555) 555-5555',
        '(666) 666-6666',
        '(777) 777-7777',
        '(999) 999-9999',
      ];

      const middleNumber = [
        800,
        866,
        888,
        900,
        911,
      ];

      if (!input) {
        return 'The input field is required';
      }

      return (
        numberUnmask(input).length < 10 ||
        phoneNumbers.indexOf(input || '') !== -1 ||
        (input && input.charAt(1) === '0') ||
        (input && input.charAt(1) === '1') ||
        (input && input.substring(6) === '000-0000') ||
        middleNumber.indexOf(Number((input && input.substring(6, 9)) || '')) !== -1
      ) ? 'Phone number is not valid' : true;
    },
  }],
  'financials.stated.employmentYears': [{
    rule: 'required',
    error: 'The input field is required',
  }],
  'signatureBy.name': [{
    rule: 'required',
    isValid: (input, err, opt, formData) => {
      if (!input) {
        return 'The input field is required';
      }
      return (input.trim() === `${(get(formData, 'applicant.firstName') || '').trim()} ${(get(formData, 'applicant.lastName') || '').trim()}`) || 'Signature does not match the first and last name';
    },
  }],
  ConsentToForward: [
    'required',
    {
      isValid: input => (
        input || 'The custom field is not valid'
      ),
    },
  ],
  ConsentElectronicCommunication: [
    'required',
    {
      isValid: input => (
        input || 'The custom field is not valid'
      ),
    },
  ],
  ConsentToCredit: [
    'required',
    {
      isValid: input => (
        input || 'The custom field is not valid'
      ),
    },
  ],
};
