/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'fakturama',
    environment,
    rootURL: '/fakturama/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. "with-controller": true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV['ember-cli-mirage'] = {
      enabled: false
    };
    ENV.APP.FIREBASE = {
      apiKey: 'AIzaSyCsqfzOAhMod8CgmLQofz24JHk8lSgpZwo',
      authDomain: 'fakturama-development.firebaseapp.com',
      databaseURL: 'https://fakturama-development.firebaseio.com',
      projectId: 'fakturama-development',
      storageBucket: '',
      messagingSenderId: '1068753197003'
    };

    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.APP.FIREBASE = {};
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'staging') {
    ENV.APP.FIREBASE = {
      apiKey: 'AIzaSyDP6rWEbwd3F8Kd-2q97a24Nqm6DmQbuLQ',
      authDomain: 'fakturama-staging.firebaseapp.com',
      databaseURL: 'https://fakturama-staging.firebaseio.com',
      projectId: 'fakturama-staging',
      storageBucket: 'fakturama-staging.appspot.com',
      messagingSenderId: '230102749631'
    };
  }

  if (environment === 'production') {
    ENV.APP.FIREBASE = {
      apiKey: 'AIzaSyBHmYWwYUmeSpuUJfDLLzmSMqd-Eleze88',
      authDomain: 'fakturama-fork.firebaseapp.com',
      databaseURL: 'https://fakturama-fork.firebaseio.com',
      projectId: 'fakturama-fork',
      storageBucket: 'fakturama-fork.appspot.com',
      messagingSenderId: '183059500058',
      appId: '1:183059500058:web:ac46fd95d63191f6ee55a3'
    };
  }

  return ENV;
};
