import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import RouteMixin, { computedDecorate } from 'ember-clothier/route-mixin';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, dataModel, appRoute;
module('ember-clothier/route-mixin', {
  setup: function() {
    App = startApp();

    var DataModel = DS.Model.extend({
      _modelName: null,
      name: DS.attr('string')
    });

    var ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    App.ApplicationRoute = Ember.Route.extend(RouteMixin);

    App.registry.register('model:data-model', DataModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);
    App.registry.register('route:application', App.ApplicationRoute);

    var store = App.__container__.lookup('store:application');
    appRoute = App.__container__.lookup('route:application');

    Ember.run(function() {
      dataModel = store.createRecord('dataModel', { name: 'name' });
    });
  },
  tearDown: function() {
    Ember.run(App, 'destroy');
  }
});

test('Decorate record', function(assert) {
  assert.equal(appRoute.decorate(dataModel, 'activatable').get('activated'), true, 'Can decorate model witin route');
});

test('Decorate collection', function(assert) {
  var decoratedCollection = appRoute.decorate([dataModel, dataModel], 'activatable');

  assert.equal(decoratedCollection.length, 2, 'Colelction decorate return array of same length');
  assert.equal(decoratedCollection.get('firstObject.activated'), true, 'Models in collections are decorated');
});

test('It can handle undefined', function(assert) {
  assert.equal(appRoute.decorate(undefined, 'activatable').get('activatable'), undefined, 'undefined do not break functionality');
});

test('Test decorator computed property', function(assert) {
  Ember.run(() => {
    var AppRoute = App.__container__.lookupFactory('route:application');

    AppRoute.reopen({
      decorated: computedDecorate('content', 'activatable')
    });

    appRoute = AppRoute.create();

    appRoute.set('content', [dataModel, dataModel]);
  });

  andThen(() => {
    assert.equal(Ember.isEmpty(appRoute.get('content')), false, 'Content property is not empty');
    assert.equal(Ember.isEmpty(appRoute.get('decorated')), false, 'Computed property is not empty');
    assert.equal(appRoute.get('decorated.firstObject.activated'), true, 'Computed collection is decorated');
  });
});
