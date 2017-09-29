const envKey = key => {
  const env = process.env.NODE_ENV || 'development';

  const configuration = {
    development: {
      host: '0.0.0.0',
      port: 8888
    },
    uat: {
      host: 'localhost',
      port: 8010
    },
    // These should match environment variables on hosted server
    production: {
      host: process.env.HOST,
      port: process.env.PORT
    }
  };

  return configuration[env][key];
};

const manifest = {
  connections: [
    {
      host: envKey('host'),
      port: envKey('port'),
      routes: {
        cors: true
      },
      router: {
        stripTrailingSlash: true
      },
      state: {strictHeader: false},
    }
  ],
  registrations: [
    {
      plugin: 'hapi-auth-jwt2'
    },
    {
      plugin: './auth'
    },
    {
      plugin: './api',
      options: { routes: { prefix: '/api' } }
    },
    {
      plugin: {
        register: 'good',
        options: {
          ops: { interval: 60000 },
          reporters: {
            console: [
              { module: 'good-squeeze', name: 'Squeeze', args: [{ error: '*' }] }, { module: 'good-console' }, 'stdout'
            ]
          }
        }
      }
    }
  ]
};

module.exports = manifest;
