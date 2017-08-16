const Home = require('./handlers/home');

exports.register = (plugin, options, next) => {
  plugin.route([
    { method: 'POST', path: '/getAmountByDate', config: Home.hello},
    { method: 'POST', path: '/getMap', config: Home.restricted },
    { method: 'POST', path: '/getMapDetails', config: Home.details },
    { method: 'GET', path: '/{path*}', config: Home.notFound }
  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};