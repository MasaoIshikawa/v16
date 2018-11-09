import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const currencyMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  integerLimit: 10,
});

export const confirmAmountOfSaleMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  integerLimit: 5,
  maxValue: 100,
  minValue: 0,
});

export function unmask(val) {
  return val.replace(/[$, ]+/g, '');
}

export function numberUnmask(val) {
  return val.match(/\d+/g).join('');
}

export function floatUnmask(val) {
  return val.match(/[\d.]+/g).join('');
}

export function removeSpace(str) {
  return str.replace(/\s+/g, '');
}
