import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import { _getPath, _getModelName, create, createCollection } from 'ember-clothier/utils';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, ObjectModel, dataModel, dataModelWithKey;
module('ember-clothier/utils', {
  beforeEach: function() {
    App = startApp();

    ObjectModel = Ember.Object.extend({
      _modelName: 'modelName',
      name: 'name'
    });

    var DataModel = DS.Model.extend({
      _modelName: null,
      name: DS.attr('string')
    });

    var ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    App.registry.register('model:data-model', DataModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);

    var store = App.registry.lookup('store:application');

    Ember.run(function() {
      dataModel = store.createRecord('dataModel', { name: 'name' });
      dataModelWithKey = store.createRecord('DataModel', { _modelName: 'other', name: 'name' });
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('getModelName', function(assert) {
  andThen(function() {
    assert.equal(_getModelName(ObjectModel.create()), 'modelName', 'Get from _modelName for non ember-data');
    assert.equal(_getModelName(dataModel), 'data-model', 'Get model name from ember data\'s key');
    assert.equal(_getModelName(dataModelWithKey), 'other', 'Ember data model name can be overwritten by _modelName');
  });
});

test('getPath', function(assert) {
  andThen(function() {
    assert.equal(_getPath(dataModel), 'decorator:data-model', 'Use model name if alias not specified');
    assert.equal(_getPath(dataModel, 'alias'), 'decorator:alias', 'Use alias over model name if it is specified');
  });
});

test('create', function(assert) {
  andThen(function() {
    assert.equal(create.bind(dataModel)(dataModel, 'activatable').get('activated'), true, 'Create decorator instance');
  });
});

test('createCollection', function(assert) {
  andThen(function() {
    var decoratedCollection = createCollection.bind(dataModel)([dataModel, dataModel], 'activatable');

    assert.equal(Ember.typeOf(decoratedCollection), 'array', 'Create collection returns array');
    assert.equal(decoratedCollection[0].get('activated'), true, 'Collection is decorated');
  });
});

