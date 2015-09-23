module.exports = {
  scenarios: [
    {
      name: 'Ember 1.10 with ember-data',
      dependencies: {
        'ember': '1.10',
        'ember-data': '1.0.0-beta.15'
      }
    },
    {
      name: 'Ember 1.11 with ember-data',
      dependencies: {
        'ember': '1.11',
        'ember-data': '1.0.0-beta.15'
      }
    },
    {
      name: 'Ember 1.12 with ember-data',
      dependencies: {
        'ember': '1.12.1',
        'ember-data': '1.0.0-beta.15'
      }
    },
    {
      name: 'Ember 1.13 with ember-data',
      dependencies: {
        'ember': '1.13.8',
        'ember-data': '1.0.0-beta.15'
      }
    },
    {
      name: 'Ember 2.0 with ember-data',
      dependencies: {
        'ember': '2.0.7',
        'ember-data': '1.0.0-beta.15'
      }
    },
    {
      name: 'Ember canary',
      dependencies: {
        'ember': 'canary'
      }
    },
    {
      name: 'Ember beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: { // Resolutions are only necessary when they do not match the version specified in `dependencies`
        'ember': 'canary'
      }
    }
  ]
};
