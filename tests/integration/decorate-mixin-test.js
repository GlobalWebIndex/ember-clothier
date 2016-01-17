import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import DecorateMixin, { computedDecorate } from 'ember-clothier/decorate-mixin';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, dataModel, appRoute;
module('ember-clothier/decorate-mixin', {
  setup: function() {
    App = startApp();

    var DataModel = DS.Model.extend({
      _modelName: null,
      name: DS.attr('string')
    });

    var ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    App.ApplicationRoute = Ember.Route.extend(DecorateMixin);

    App.registry.register('model:data-model', DataModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);
    App.registry.register('route:application', App.ApplicationRoute);

    var store = App.__container__.lookup('store:application');
    appRoute = App.__container__.lookup('route:application');

    Ember.run(() => {
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
  var decoratedCollection = appRoute.decorate(Ember.A([dataModel, dataModel]), 'activatable');

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

    appRoute = AppRoute.create({
      content: Ember.A([dataModel, dataModel])
    });
  });

  andThen(() => {
    assert.equal(Ember.isEmpty(appRoute.get('decorated')), false, 'Computed property is not empty');
    assert.equal(appRoute.get('decorated.firstObject.activated'), true, 'Computed collection is decorated');
    assert.equal(appRoute.get('decorated').length, 2, 'Default length is 2');

    Ember.run(() => {
      appRoute.get('content').pushObject(dataModel);
    });
  });

  andThen(() => {
    assert.equal(appRoute.get('decorated').length, 3, 'Can push object to computed decorator');

    Ember.run(() => {
      appRoute.set('content', dataModel);
    });
  });

  andThen(() => {
    assert.equal(appRoute.get('decorated.activated'), true, 'Object should be also decorated');
  });
});
