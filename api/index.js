const Home = require('./handlers/home');

exports.register = (plugin, options, next) => {
    plugin.route([
        // 老平台
        {method: 'POST', path: '/getAmountByDate', config: Home.hello},
        {method: 'POST', path: '/getMap', config: Home.restricted},
        {method: 'POST', path: '/getMapDetails', config: Home.details},
        //新平台接口
        {method: 'POST', path: '/agency/getAmountByDate', config: Home.agencyAmount},
        {method: 'POST', path: '/agency/getTotalAmount', config: Home.agencyTotalAmount},
        {method: 'POST', path: '/agency/getLine', config: Home.getLine},
        {method: 'POST', path: '/agency/getMap', config: Home.getMap},
        {method: 'GET', path: '/{path*}', config: Home.notFound},
        //APP
        {method: 'POST', path: '/app/getAmountByDate', config: Home.appAmount}
    ]);

    next();
};

exports.register.attributes = {
    name: 'api'
};