module.exports = {
  '/proxy/remote': {
    target: 'http://localhost:4201',
    secure: false,
    pathRewrite: {
      '^/proxy/remote': '',
    },
  },
};
