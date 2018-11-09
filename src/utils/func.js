import dateFns from 'date-fns';

export const getCurrentDate = () => dateFns.format(new Date(), 'M/DD/YYYY');
export const formatCurrency = (x, decimalCount) => Number.parseFloat(x).toFixed(decimalCount).replace(/\d(?=(\d{3})+\.)/g, '$&,');
