import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import RouteMixin from 'ember-clothier/route-mixin';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, dataModel, appRoute;
module('ember-clothier/utils', {
  beforeEach: function() {
    App = startApp();

    var DataModel = DS.Model.extend({
      _modelName: null,
      name: DS.attr('string')
    });

    var ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    var ApplicationRoute = Ember.Route.extend(RouteMixin, {});

    App.registry.register('model:data-model', DataModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);
    App.registry.register('route:application', ApplicationRoute);

    var store = App.registry.lookup('store:application');
    appRoute = App.registry.lookup('route:application');

    Ember.run(function() {
      dataModel = store.createRecord('dataModel', { name: 'name' });
    });
  },
  afterEach: function() {
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
