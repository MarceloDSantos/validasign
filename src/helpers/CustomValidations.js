/* eslint-disable eqeqeq */
import validator from 'validator';
import { inputType, removeMask } from '../components/Inputs/InputHelper';

// Mensagens de validação
const validationMessages = {
  required: 'Campo obrigatório',
  email: 'E-mail inválido',
  cpf: 'CPF inválido',
  cnpj: 'CNPJ inválido',
  data: 'Data inválida',
  dataHora: 'Data/Hora inválidas',
  maiorQueZero: 'Valor deve ser maior que zero',
  min6: 'Mínimo de 6 caracteres',
  repeatSenha: 'Senhas não conferem'
};

// Tipos de validações
const validationType = {
  cpf: 'cpf',
  cnpj: 'cnpj',
  data: 'data',
  dataHora: 'dataHora',
  maiorQueZero: 'maiorQueZero',
  cpfExistente: 'cpfExistente',
  repeatSenha: 'repeatSenha'
};

// Validações customizadas
const CustomValidations = async (type, value) => {
  let validated = false;
  let validatedMessage = '';

  switch (type) {
    case validationType.cpf:
      if (!value || value.length === 0 || validateCpf(value)) {
        validated = true;
      } else {
        validatedMessage = validationMessages.cpf;
      }
      break;

    case validationType.cnpj:
      if (!value || value.length === 0 || validateCnpj(value)) {
        validated = true;
      } else {
        validatedMessage = validationMessages.cnpj;
      }
      break;

    case validationType.data:
      if (
        !value ||
        value.length === 0 ||
        validator.isDate(value, { format: 'DD/MM/YYYY' })
      ) {
        validated = true;
      } else {
        validatedMessage = validationMessages.data;
      }
      break;

    case validationType.dataHora:
      if (!value || value.length === 0) {
        validated = true;
      } else {
        let dataHora = value.split(' ');
        dataHora[0] = dataHora[0].substr(0, 10).split('/').reverse().join('-');

        if (validator.isISO8601(`${dataHora[0]} ${dataHora[1]}`)) {
          validated = true;
        } else {
          validatedMessage = validationMessages.dataHora;
        }
      }
      break;

    case validationType.maiorQueZero:
      if (!value || value.length === 0) {
        validated = true;
      } else {
        var number = value.replace(/[^0-9,-]*/g, '').replace(',', '.');
        if (!number) number = 0;

        if (number > 0) {
          validated = true;
        } else {
          validatedMessage = validationMessages.maiorQueZero;
        }
      }
      break;

    case validationType.repeatSenha:
      if (!value || value.length === 0) {
        validated = true;
      } else {
        validatedMessage = validationMessages.repeatSenha;
      }
      break;

    default:
      validatedMessage = 'Tipo não definido';
      break;
  }

  if (validated) {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error(validatedMessage));
  }
};

const validateCpf = (val) => {
  let cpf = val.trim();

  cpf = cpf.replace(/\./g, '');
  cpf = cpf.replace('-', '');
  cpf = cpf.split('');

  let v1 = 0;
  let v2 = 0;
  let aux = false;
  let i = 0;
  let p = 0;

  for (i = 1; cpf.length > i; i++) {
    if (cpf[i - 1] != cpf[i]) {
      aux = true;
    }
  }

// Ignorar para testes com Cpf 111.111.111-11

//   if (aux == false) {
//     return false;
//   }

  for (i = 0, p = 10; cpf.length - 2 > i; i++, p--) {
    v1 += cpf[i] * p;
  }

  v1 = (v1 * 10) % 11;

  if (v1 == 10) {
    v1 = 0;
  }

  if (v1 != cpf[9]) {
    return false;
  }

  for (i = 0, p = 11; cpf.length - 1 > i; i++, p--) {
    v2 += cpf[i] * p;
  }

  v2 = (v2 * 10) % 11;

  if (v2 == 10) {
    v2 = 0;
  }

  if (v2 != cpf[10]) {
    return false;
  } else {
    return true;
  }
};

const validateCnpj = (val) => {
  let cnpj = val.trim();

  cnpj = cnpj.replace(/\./g, '');
  cnpj = cnpj.replace('-', '');
  cnpj = cnpj.replace('/', '');
  cnpj = cnpj.split('');

  let v1 = 0;
  let v2 = 0;
  let aux = false;
  let i,
    p1,
    p2 = 0;

  for (i = 1; cnpj.length > i; i++) {
    if (cnpj[i - 1] != cnpj[i]) {
      aux = true;
    }
  }

  if (aux == false) {
    return false;
  }

  for (i = 0, p1 = 5, p2 = 13; cnpj.length - 2 > i; i++, p1--, p2--) {
    if (p1 >= 2) {
      v1 += cnpj[i] * p1;
    } else {
      v1 += cnpj[i] * p2;
    }
  }

  v1 = v1 % 11;

  if (v1 < 2) {
    v1 = 0;
  } else {
    v1 = 11 - v1;
  }

  if (v1 != cnpj[12]) {
    return false;
  }

  for (i = 0, p1 = 6, p2 = 14; cnpj.length - 1 > i; i++, p1--, p2--) {
    if (p1 >= 2) {
      v2 += cnpj[i] * p1;
    } else {
      v2 += cnpj[i] * p2;
    }
  }

  v2 = v2 % 11;

  if (v2 < 2) {
    v2 = 0;
  } else {
    v2 = 11 - v2;
  }

  if (v2 != cnpj[13]) {
    return false;
  } else {
    return true;
  }
};

export { CustomValidations, validationType, validationMessages };
