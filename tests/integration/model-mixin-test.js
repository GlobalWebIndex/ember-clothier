import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import ModelMixin, { decorateRelation } from 'ember-clothier/model-mixin';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, parentModel, childModel1, childModel2, store;
module('ember-clothier/model-mixin', {
  beforeEach() {
    App = startApp();

    let ParentModel = DS.Model.extend(ModelMixin, {
      name: DS.attr('string'),
      children: DS.hasMany('childModel'),

      decoratedChildren: decorateRelation('children', 'activatable', 'editable')
    });

    let ChildModel = DS.Model.extend(ModelMixin, {
      name: DS.attr('string'),
      parent: DS.belongsTo('parentModel'),

      activatableParent: decorateRelation('parent', 'activatable')
    });

    let ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    let EditableDecorator = Decorator.extend({
      edited: true,
    });

    App.registry.register('model:parent-model', ParentModel);
    App.registry.register('model:child-model', ChildModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);
    App.registry.register('decorator:editable', EditableDecorator);

    store = App.__container__.lookup('store:application');

    Ember.run(() => {
      parentModel = store.createRecord('parentModel', { name: 'name' });
      childModel1 = store.createRecord('childModel', { parent: parentModel });
      childModel2 = store.createRecord('childModel', { parent: parentModel });
    });
  },
  afterEach() {
    Ember.run(App, 'destroy');
  }
});

test('model instance can be decorated', function (assert) {
  assert.equal(parentModel.decorate('activatable').get('activated'), true, 'Model instance can be decorated');
});

test('Decorating hasMany relationships', function (assert) {
  assert.equal(parentModel.get('decoratedChildren').length, 2, 'Has decorated children');
  assert.equal(parentModel.get('decoratedChildren.firstObject.activated'), true, 'Model in hasMany relationship is activable');
  assert.equal(parentModel.get('decoratedChildren.firstObject.edited'), true, 'Model in hasMany relationship is editable');
});

test('Decorating belongsTo relationships', function(assert) {
  assert.equal(childModel1.get('activatableParent.activated'), true, 'Model in belonsTo relatioonship is decorated');
});

test('Push decorator to hasMany relation (ember-data)', function (assert) {
  let newChildModel, newDecoratedChildModel;
  Ember.run(() => {
    newChildModel = store.createRecord('childModel', { name: 'new child' });
    newDecoratedChildModel = newChildModel.decorate('activatable');
    parentModel.get('children').addObject(newDecoratedChildModel);
  });

  assert.equal(parentModel.get('children').contains(newChildModel), true, 'Decorated record can be add to hasMany relation');
});


test('Add decorated object to belongsTo relation (ember-data)', function (assert) {
  var newParentModel, newDecoratedParentModel;

  Ember.run(() => {
    newParentModel = store.createRecord('parentModel', { name: 'new parent' });
    newDecoratedParentModel = newParentModel.decorate('activatable');
    childModel1.set('parent', newDecoratedParentModel);
  });

  assert.equal(newParentModel.get('children').contains(childModel1), true, 'Decorated record can be add to belongsTo relation');
});
