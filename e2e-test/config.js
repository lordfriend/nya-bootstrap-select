// conf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: 'specs/*.js',
  capabilities: {
    browserName: 'chrome'
  }
};
