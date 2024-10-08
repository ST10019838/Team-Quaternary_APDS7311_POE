import a from 'axios';

const axios = a.create({
  baseURL: 'https://localhost:5000/api',
});

export default axios;
