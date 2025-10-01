/* eslint-disable no-case-declarations */
import { mask as masker } from 'remask';
import validator from 'validator';

const createCustomNumberMask = (customMask) => {
  return {
    prefix: customMask.prefixo ? customMask.prefixo : '',
    suffix: customMask.sufixo ? customMask.sufixo : '',
    includeThousandsSeparator:
      customMask.incluirSeparadorMilhar !== undefined
        ? customMask.incluirSeparadorMilhar
        : true,
    thousandsSeparatorSymbol: '.',
    allowDecimal:
      customMask.permitirDecimal !== undefined
        ? customMask.permitirDecimal
        : false,
    decimalSymbol: ',',
    decimalLimit: customMask.casasDecimais ? customMask.casasDecimais : 0,
    integerLimit: customMask.quantInteiros ? customMask.quantInteiros : 13,
    allowNegative:
      customMask.permitirNegativo !== undefined
        ? customMask.permitirNegativo
        : false,
    allowLeadingZeroes: customMask.permitirZeroEsquerda
      ? customMask.permitirZeroEsquerda !== undefined
      : false,
  };
};

const inputType = {
  cpf: {
    mask: ['999.999.999-99'],
    placeholder: '000.000.000-00',
  },

  cnpj: {
    mask: ['99.999.999/9999-99'],
    placeholder: '00.000.000/0000-00',
  },

  telefone: {
    mask: ['(99) 9999-9999', '(99) 99999-9999'],
    placeholder: '(00) 00000-0000',
  },

  data: {
    mask: ['99/99/9999'],
    placeholder: 'DD/MM/AAAA',
  },

  dataHora: {
    mask: ['99/99/9999 99:99'],
    placeholder: 'DD/MM/AAAA HH:MM',
  },

  mesAno: {
    mask: ['99/9999'],
    placeholder: 'MM/AAAA',
  },

  placa: {
    mask: ['AAA 9S99'],
    placeholder: 'AAA 0000',
  },

  cep: {
    mask: ['99999-999'],
    placeholder: '00000-000',
  },

  moeda: {
    key: 'moeda',
    mask: createCustomNumberMask({
      permitirDecimal: true,
      casasDecimais: 2,
      prefixo: 'R$ ',
    }),
  },

  moedaNeg: {
    key: 'moedaNeg',
    mask: createCustomNumberMask({
      permitirDecimal: true,
      casasDecimais: 2,
      prefixo: 'R$ ',
      permitirNegativo: true,
    }),
  },

  decimal: {
    key: 'decimal',
    mask: createCustomNumberMask({
      permitirDecimal: true,
      casasDecimais: 2,
    }),
  },

  decimalNeg: {
    key: 'decimalNeg',
    mask: createCustomNumberMask({
      permitirDecimal: true,
      casasDecimais: 2,
      permitirNegativo: true,
    }),
  },

  inteiro: {
    key: 'inteiro',
    mask: createCustomNumberMask({
      permitirDecimal: false,
    }),
  },

  inteiroNeg: {
    key: 'inteiroNeg',
    mask: createCustomNumberMask({
      permitirDecimal: false,
      permitirNegativo: true,
    }),
  },
};

/**
 * Remove máscara de valores vindos do InputMask
 * @param {inputType} type
 * @param {String} value
 * @example
 * removeMask(inputType.cpf, value)
 * @returns {String}
 */
const removeMask = (type, value) => {
  if (value === undefined || value === null) return value;

  switch (type) {
    case inputType.cpf:
    case inputType.cnpj:
    case inputType.telefone:
    case inputType.cep:
    case inputType.mesAno:
      value = value.replace(/[^0-9]*/g, '');
      break;

    case inputType.data:
      value = value.substr(0, 10).split('/').reverse().join('-');
      break;

    case inputType.dataHora:
      let dataHora = value.split(' ');
      dataHora[0] = dataHora[0].substr(0, 10).split('/').reverse().join('-');
      value = `${dataHora[0]} ${dataHora[1]}`;
      break;

    case inputType.placa:
      value = value.replace(' ', '');
      break;

    default:
      break;
  }

  return value;
};

/**
 * Remove máscara de valores vindos do InputNumber
 * @param {String} value
 * @returns {Number}
 */
const removeNumberMask = (value) => {
  if (value === undefined || value === null) return value;

  // Remove a máscara, deixa apenas números e sinal de negativo
  value = value.replace(/[^0-9,-]*/g, '').replace(',', '.');

  let valueSplit = value.split('.');

  if (valueSplit.length === 2) {
    value = parseFloat(value).toFixed(valueSplit[1].length);
    // Converte para float
    value = validator.toFloat(value);
    if (!value) value = 0;
  } else {
    value = parseInt(value);
  }

  return value;
};

/**
 * Adiciona máscara nos valores
 * @param {inputType} type
 * @param {any} value
 * @example
 * addMask(inputType.cpf, value)
 * @returns {String}
 */
const addMask = (type, value) => {
  if (value === undefined || value === null) return value;

  switch (type) {
    case inputType.cpf:
    case inputType.cnpj:
    case inputType.telefone:
    case inputType.cep:
    case inputType.placa:
    case inputType.mesAno:
      value = masker(value, type.mask);
      break;

    case inputType.data:
      value = value.substr(0, 10).split('-').reverse().join('/');
      break;

    case inputType.dataHora:
      let dataHora = value.split(' ');
      dataHora[0] = dataHora[0].substr(0, 10).split('-').reverse().join('/');
      value = `${dataHora[0]} ${dataHora[1]}`;
      break;

    default:
      break;
  }

  return value;
};

/**
 * Adiciona máscara nos valores numéricos
 * @param {inputType} type
 * @param {any} value
 * @param {any} customMask
 * @example
 * addNumberMask(inputType.moeda, value),
 * @returns {String}
 */
const addNumberMask = (type, value, customMask) => {
  if (value === undefined || value === null) return value;

  let mask = type.mask;
  let numberFormated;

  value = value.toString();

  if (customMask) {
    customMask = {
      prefixo: customMask.prefixo ? customMask.prefixo : mask.prefix,
      sufixo: customMask.sufixo ? customMask.sufixo : mask.suffix,
      incluirSeparadorMilhar:
        customMask.incluirSeparadorMilhar !== undefined
          ? customMask.incluirSeparadorMilhar
          : mask.includeThousandsSeparator,
      permitirDecimal:
        customMask.permitirDecimal !== undefined
          ? customMask.permitirDecimal
          : mask.allowDecimal,
      casasDecimais: customMask.casasDecimais
        ? customMask.casasDecimais
        : mask.decimalLimit,
      quantInteiros: customMask.quantInteiros
        ? customMask.quantInteiros
        : mask.integerLimit,
      permitirNegativo:
        customMask.permitirNegativo !== undefined
          ? customMask.permitirNegativo
          : mask.allowNegative,
      permitirZeroEsquerda:
        customMask.permitirZeroEsquerda !== undefined
          ? customMask.permitirZeroEsquerda
          : mask.allowLeadingZeroes,
    };

    mask = createCustomNumberMask(customMask);
  }

  if (type.key.startsWith('moeda') || type.key.startsWith('decimal')) {
    // Converte para float
    let currency = validator.toFloat(value);
    if (!currency) currency = 0;

    // Formata como moeda/decimal do Brasil
    numberFormated = currency.toLocaleString('pt-br', {
      minimumFractionDigits: mask.decimalLimit,
      maximumFractionDigits: mask.decimalLimit,
    });
  } else if (type.key.startsWith('inteiro')) {
    // Remove a máscara, deixa apenas números e sinal de negativo
    let integerReplace = parseInt(value.replace(/[^0-9-]*/g, ''));
    integerReplace = integerReplace ? integerReplace : 0;

    // Formata como inteiro do Brasil
    if (mask.includeThousandsSeparator) {
      numberFormated = integerReplace.toLocaleString('pt-br');
    } else {
      numberFormated = integerReplace;
    }
  }

  // Adiciona prefixo/sufixo
  if (mask.prefix) numberFormated = `${mask.prefix}${numberFormated}`;
  if (mask.suffix) numberFormated = `${numberFormated}${mask.suffix}`;

  return numberFormated;
};

export {
  addMask,
  addNumberMask,
  createCustomNumberMask,
  inputType,
  removeMask,
  removeNumberMask,
};
