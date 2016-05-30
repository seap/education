export default {
  isProduction: process.env.NODE_ENV === 'production',
  host: process.env.HOST || 'w.siline.cn',
  port: process.env.PORT || 3000,
  publicPath: process.env.PUBLIC_PATH || 'dist',
  hotPort: process.env.PORT ? (parseInt(process.env.PORT, 10) + 1) : 3001,
};
