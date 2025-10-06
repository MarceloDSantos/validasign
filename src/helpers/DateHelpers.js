import moment from 'moment';
import 'moment/dist/locale/pt-br';

moment.locale('pt-br');

// Obtém uma data baseado no número de dias informado
const getDateFromNumDays = (numDays) => {
  return moment().add(numDays, 'days').format('L');
};

// Obtém uma data baseado no número de dias informado
// partindo do dia de Ontem
const getDateFromYesterday = (numDays) => {
  return moment().add(-1, 'days').add(numDays, 'days').format('L');
};

// Obtém uma data baseado no número de dias informado
const getDateFromToday = (numDays) => {
  return moment().add(numDays, 'days').format('L');
};

const getNomeDiaDaSemana = (data) => {
  const diasDaSemana = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  if (data === undefined)
    return "";

  const newData = moment(data, 'DD/MM/YYYY')

  var resp = diasDaSemana[newData.weekday()];

  return resp;
};

const getDiferencaHorasMinutos = (data1, data2) => {
  // Converte as datas para objetos Date (se não forem) e obtém a diferença em milissegundos
  const diferencaEmMilissegundos = Math.abs(new Date(data2).getTime() - new Date(data1).getTime());

  // Calcula a diferença total em minutos
  const diferencaEmMinutosTotais = diferencaEmMilissegundos / (1000 * 60);

  // Calcula dias restantes
  const diasRestantes = Math.floor((diferencaEmMinutosTotais / 60) / 24);

  // Calcula as horas restantes
  const horasRestantes = Math.floor((diferencaEmMinutosTotais / 60) / 60);

  // Calcula os minutos restantes
  const minutosRestantes = Math.floor(diferencaEmMinutosTotais % 60);

  return {
    dias: diasRestantes,
    horas: horasRestantes,
    minutos: minutosRestantes
  };
}

export {
  getDateFromNumDays,
  getDateFromYesterday,
  getDateFromToday,
  getNomeDiaDaSemana,
  getDiferencaHorasMinutos
};



