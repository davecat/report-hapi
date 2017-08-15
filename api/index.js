const Home = require('./handlers/home');

exports.register = (plugin, options, next) => {
  plugin.route([
    { method: 'POST', path: '/getAmountByDate', config: Home.hello},
    { method: 'GET', path: '/restricted', config: Home.restricted },
    { method: 'GET', path: '/{path*}', config: Home.notFound }
  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};