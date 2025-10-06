import axios from 'axios';
import { AMBIENTEAPI } from './helpers/Constants';

// Define a ULR Base da API
export default axios.create({
  baseURL:
    AMBIENTEAPI === 'dev'
      ? 'http://localhost:5757'
      : 'https://api.validasign.ampara.twsoft.com.br/',
});
