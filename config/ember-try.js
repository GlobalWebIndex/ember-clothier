module.exports = {
  scenarios: [
    {
      name: 'Ember 1.10 with ember-data',
      dependencies: {
        'ember': '1.10.1',
        'ember-data': '1.0.0-beta.15'
      }
    },
    {
      name: 'Ember 1.11 with ember-data',
      dependencies: {
        'ember': '1.11.3',
        'ember-data': '1.0.0-beta.19'
      }
    },
    {
      name: 'Ember 1.12 with ember-data',
      dependencies: {
        'ember': '1.12.1',
        'ember-data': '1.0.0-beta.19'
      }
    },
    {
      name: 'Ember 1.13 with ember-data',
      dependencies: {
        'ember': '1.13.10',
        'ember-data': '1.13.13'
      }
    },
    {
      name: 'Ember 2.0 with ember-data',
      dependencies: {
        'ember': '2.0.2',
        'ember-data': '2.0.1'
      }
    },
    {
      name: 'Ember canary',
      dependencies: {
        'ember': 'canary'
      }
    }
  ]
};
