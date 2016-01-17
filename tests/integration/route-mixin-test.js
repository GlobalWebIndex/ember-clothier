import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import RouteMixin from 'ember-clothier/route-mixin';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, dataModel, appRoute;
module('ember-clothier/route-mixin', {
  setup: function() {
    App = startApp();

    let DataModel = DS.Model.extend({
      _modelName: null,
      name: DS.attr('string')
    });

    let ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    App.ApplicationRoute = Ember.Route.extend(RouteMixin);

    App.registry.register('model:data-model', DataModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);
    App.registry.register('route:application', App.ApplicationRoute);

    let store = App.__container__.lookup('store:application');
    appRoute = App.__container__.lookup('route:application');

    Ember.run(() => {
      dataModel = store.createRecord('dataModel', { name: 'name' });
    });
  },
  tearDown() {
    Ember.run(App, 'destroy');
  }
});

test('Decorate record', function(assert) {
  assert.equal(appRoute.decorate(dataModel, 'activatable').get('activated'), true, 'Can decorate model witin route');
});

test('Decorate collection', function(assert) {
  let decoratedCollection = appRoute.decorate([dataModel, dataModel], 'activatable');

  assert.equal(decoratedCollection.length, 2, 'Colelction decorate return array of same length');
  assert.equal(decoratedCollection.get('firstObject.activated'), true, 'Models in collections are decorated');
});

test('It can handle undefined', function(assert) {
  assert.equal(appRoute.decorate(undefined, 'activatable').get('activatable'), undefined, 'undefined do not break functionality');
});
