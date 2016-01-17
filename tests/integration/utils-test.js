import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import { _getPath, _getModelName, _create, _createCollection, decorate } from 'ember-clothier/utils';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, ObjectModel, dataModel, dataModelWithKey;
module('ember-clothier/utils', {
  beforeEach() {
    App = startApp();

    ObjectModel = Ember.Object.extend({
      _modelName: 'modelName',
      name: 'name'
    });

    let DataModel = DS.Model.extend({
      _modelName: null,
      name: DS.attr('string')
    });

    let ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    App.registry.register('model:data-model', DataModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);

    let store = App.__container__.lookup('store:application');

    Ember.run(() => {
      dataModel = store.createRecord('dataModel', { name: 'name' });
      dataModelWithKey = store.createRecord('DataModel', { _modelName: 'other', name: 'name' });
    });
  },
  afterEach() {
    Ember.run(App, 'destroy');
  }
});

test('getModelName', function (assert) {
  assert.equal(_getModelName(ObjectModel.create()), 'modelName', 'Get from _modelName for non ember-data');
  assert.equal(_getModelName(dataModel), 'data-model', 'Get model name from ember data\'s key');
  assert.equal(_getModelName(dataModelWithKey), 'other', 'Ember data model name can be overwritten by _modelName');
});

test('getPath', function (assert) {
  assert.equal(_getPath(dataModel), 'decorator:data-model', 'Use model name if alias not specified');
  assert.equal(_getPath(dataModel, 'alias'), 'decorator:alias', 'Use alias over model name if it is specified');
});

test('create', function (assert) {
  assert.equal(_create.call(dataModel, dataModel, 'activatable').get('activated'), true, 'Create decorator instance');
});

test('createCollection', function (assert) {
  let decoratedCollection = _createCollection.call(dataModel, [dataModel, dataModel], 'activatable');

  assert.equal(Ember.typeOf(decoratedCollection), 'array', 'Create collection returns array');
  assert.equal(decoratedCollection[0].get('activated'), true, 'Collection is decorated');
});

test('decorate', function (assert) {
  assert.equal(decorate.call(dataModel, dataModel, 'activatable').get('activated'), true, 'Create decorator instance');

  let decoratedCollection = decorate.call(dataModel, [dataModel, dataModel], 'activatable');

  assert.equal(Ember.typeOf(decoratedCollection), 'array', 'Create collection returns array');
  assert.equal(decoratedCollection[0].get('activated'), true, 'Collection is decorated');
});
