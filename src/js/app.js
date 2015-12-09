// Angular app declaration
const dependencies = [
  'ionic',
  'starter.controllers',
  'starter.services'
];

angular.module('starter', dependencies);


// App files
require('./app.constants.js');
require('./app.config.js');
require('./app.run.js');
require('./controllers');
require('./services');