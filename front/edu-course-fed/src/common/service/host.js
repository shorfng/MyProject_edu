const isDevelopment = process.env.NODE_ENV === 'development';
const HOST = {
    gwctx: isDevelopment ? '' : 'https://gw.lagou.com',
    gzctx: isDevelopment ? '' : 'http://edufront.lagou.com/front',
    gnctx: isDevelopment ? '' :  'http://edufront.lagou.com/front',
};
export default HOST;
