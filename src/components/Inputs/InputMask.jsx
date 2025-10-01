import { Input } from 'antd';
import React from 'react';
import { mask as masker, unMask } from 'remask';
import { inputType } from './InputHelper';

const InputMask = ({ type, onChange, ...props }) => {
  const mask = type.mask;
  const placeholder = type.placeholder;

  // Aplica a máscara
  const handleOnChange = (event) => {
    let originalValue = unMask(event.target.value);

    switch (type) {
      case inputType.placa:
        originalValue = originalValue.toUpperCase();
        break;

      default:
        break;
    }

    const maskedValue = masker(originalValue, mask);

    onChange(maskedValue);
  };

  // Verifica se não preencheu toda a máscara e limpa o campo
  const handleOnBlur = (event) => {
    const maskedValue = event.target.value;

    let validMask = false;

    for (let i = 0; i < mask.length; i++) {
      if (maskedValue.length === mask[i].length) {
        validMask = true;
        break;
      }
    }

    if (!validMask) {
      onChange('');
    }
  };

  const handleOnFocus = (event) => {
    event.target.select();
  };

  return (
    <Input
      {...props}
      placeholder={placeholder}
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      onFocus={handleOnFocus}
      allowClear
    />
  );
};

export default InputMask;
