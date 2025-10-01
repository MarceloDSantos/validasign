import { Input } from 'antd';
import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import validator from 'validator';
import { createCustomNumberMask } from './InputHelper';

const InputNumber = React.forwardRef(
  // eslint-disable-next-line no-unused-vars
  ({ type, value, customMask, onChange, autoFocus }, ref) => {
    let mask = type.mask;
    let placeholder = type.placeholder;
    let numberMask = [];

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

    numberMask = createNumberMask(mask);

    const handleOnBlur = (event) => {
      const value = event.target.value;
      let numberFormated;

      if (type.key.startsWith('moeda') || type.key.startsWith('decimal')) {
        // Remove a máscara, deixa apenas números e sinal de negativo
        let currencyReplace = parseFloat(
          value.replace(/[^0-9,-]*/g, '').replace(',', '.')
        ).toFixed(mask.decimalLimit);

        // Converte para float
        let currency = validator.toFloat(currencyReplace);
        if (!currency) currency = 0;

        // Formata como moeda/decimal do Brasil
        numberFormated = currency.toLocaleString('pt-br', {
          minimumFractionDigits: mask.decimalLimit,
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

      onChange(numberFormated);
    };

    const handleOnFocus = (event) => {
      //event.target.setSelectionRange(0, event.target.value.lenght);
      event.target.select();
    };

    return (
      <MaskedInput
        mask={numberMask}
        placeholder={placeholder}
        value={value}
        render={(ref, props) => {
          return (
            <Input
              {...props}
              ref={(input) => ref(input && input.input)}
              value={value}
              onChange={(e) => {
                props.onChange(e);
                onChange(e);
              }}
              onBlur={handleOnBlur}
              onFocus={handleOnFocus}
              allowClear
              autoFocus={autoFocus}
            />
          );
        }}
      />
    );
  }
);

export default InputNumber;
