
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment ? '' : 'https://gate.lagou.com/v1/neirong';
