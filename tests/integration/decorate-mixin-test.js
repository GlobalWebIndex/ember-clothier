import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import DecorateMixin, { computedDecorate, decoratorFactory } from 'ember-clothier/decorate-mixin';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, dataModel, appRoute, store;
module('ember-clothier/decorate-mixin', {
  setup() {
    App = startApp();

    let DataModel = DS.Model.extend({
      _modelName: null,
      name: DS.attr('string')
    });

    let ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    let EditableDecorator = Decorator.extend({
      edited: true,
    });

    App.ApplicationRoute = Ember.Route.extend(DecorateMixin);

    App.registry.register('model:data-model', DataModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);
    App.registry.register('decorator:editable', EditableDecorator);
    App.registry.register('route:application', App.ApplicationRoute);

    store = App.__container__.lookup('store:application');
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

test('Multi decorating record', function(assert) {
  let decoratedModel = appRoute.decorate(dataModel, 'activatable', 'editable');

  assert.equal(decoratedModel.get('activated'), true, 'Decorate model with activable stuff');
  assert.equal(decoratedModel.get('edited'), true, 'Decorate model with editable stuff');
});

test('Decorate collection', function(assert) {
  let decoratedCollection = appRoute.decorate(Ember.A([dataModel, dataModel]), 'activatable');

  assert.equal(decoratedCollection.length, 2, 'Colelction decorate return array of same length');
  assert.equal(decoratedCollection.get('firstObject.activated'), true, 'Models in collections are decorated');
});

test('It can handle undefined', function(assert) {
  assert.equal(appRoute.decorate(undefined, 'activatable').get('activatable'), undefined, 'undefined do not break functionality');
});

test('Test decorator computed property', function(assert) {
  Ember.run(() => {
    let AppRoute = App.__container__.lookupFactory('route:application');

    AppRoute.reopen({
      filteredContent: Ember.computed('content.@each', 'content', function() {
        return Ember.makeArray(this.get('content')).filter(m => m.get('name') !== 'forbidden');
      }),
      decorated: computedDecorate('filteredContent', 'activatable', 'editable'),
      decoratedObject: computedDecorate('content.firstObject', 'activatable', 'editable')
    });

    appRoute = AppRoute.create({
      content: Ember.A([dataModel, dataModel])
    });

    //initial
    assert.equal(Ember.isEmpty(appRoute.get('decorated')), false, 'Computed property is not empty');
    assert.equal(appRoute.get('decorated.firstObject.activated'), true, 'Computed collection is activable');
    assert.equal(appRoute.get('decorated.firstObject.edited'), true, 'Computed collection is editable');

    assert.equal(appRoute.get('decorated').length, 2, 'Default length is 2');
    assert.equal(appRoute.get('decoratedObject.activated'), true, 'Object should be also activable');
    assert.equal(appRoute.get('decoratedObject.edited'), true, 'Object should be also editable');

    //push object
    appRoute.get('content').pushObject(dataModel);
    assert.equal(appRoute.get('decorated').length, 3, 'Can push object to computed decorator');

    //push filtered out
    appRoute.get('content').pushObject(store.createRecord('data-model', { name: 'forbidden' }));
    assert.equal(appRoute.get('content').length, 4, 'It is pushed to content');
    assert.equal(appRoute.get('decorated').length, 3, 'It is filtered properly');
  });
});

test('Test can handle setter over computed decorate in decoratorFactory', function (assert) {
  Ember.run(() => {
    let AppRoute = App.__container__.lookupFactory('route:application');

    AppRoute.reopen({
      decorated: decoratorFactory ('activatable')
    });

    appRoute = AppRoute.create();

    appRoute.set('decorated', Ember.A([dataModel, dataModel]));
    assert.equal(appRoute.get('decorated.firstObject.activated'), true, 'first Object is decorated');
    assert.equal(appRoute.get('decorated.lastObject.activated'), true, 'last Object is decorated');
  });
});
