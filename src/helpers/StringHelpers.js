// Função para converter palavras para o Plural conforme Quantidade
const converterTextoPlural = (palavra, qut = 1) => {
  if (qut <= 1) {
    return palavra.toLowerCase();
  }

  palavra = palavra.toLowerCase();

  if (palavra.endsWith('ão')) {
    return palavra.slice(0, -2) + 'ões';
  } else if (['r', 's', 'z'].includes(palavra.slice(-1))) {
    return palavra + 'es';
  } else if (['m'].includes(palavra.slice(-1))) {
    return palavra.slice(0, -1) + 'ns';
  } else if (['a', 'e', 'o', 'u'].includes(palavra.slice(-1))) {
    return palavra + 's';
  } else {
    return palavra + 'es';
  }
};

export { converterTextoPlural };
