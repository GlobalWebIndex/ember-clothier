import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';
import ModelMixin, { decorateHasMany, decorateBelongsTo } from 'ember-clothier/model-mixin';
import startApp from '../helpers/start-app';
import DS from 'ember-data';
import Ember from 'ember';

var App, parentModel, childModel1, childModel2;
module('ember-clothier/model-mixin', {
  beforeEach: function() {
    App = startApp();

    var ParentModel = DS.Model.extend(ModelMixin, {
      name: DS.attr('string'),
      children: DS.hasMany('childModel'),

      activatableChildren: decorateHasMany('children', 'activatable')
    });

    var ChildModel = DS.Model.extend(ModelMixin, {
      name: DS.attr('string'),
      parent: DS.belongsTo('parentModel'),

      activatableParent: decorateBelongsTo('parent', 'activatable')
    });

    var ActivatableDecorator = Decorator.extend({
      activated: true,
    });

    App.registry.register('model:parent-model', ParentModel);
    App.registry.register('model:child-model', ChildModel);
    App.registry.register('decorator:activatable', ActivatableDecorator);

    var store = App.__container__.lookup('store:application');

    Ember.run(function() {
      parentModel = store.createRecord('parentModel', { name: 'name' });
      childModel1 = store.createRecord('childModel', { parent: parentModel });
      childModel2 = store.createRecord('childModel', { parent: parentModel });
    });
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('model instance can be decorated', function(assert) {
  assert.equal(parentModel.decorate('activatable').get('activated'), true, 'Model instance can be decorated');
});

test('Decorating hasMany relationships', function(assert) {
  assert.equal(parentModel.get('activatableChildren').length, 2, 'Has decorated children');
  assert.equal(parentModel.get('activatableChildren.firstObject.activated'), true, 'Model in hasMany relationship is decorated');
});

test('Decorating belongsTo relationships', function(assert) {
  assert.equal(childModel1.get('activatableParent.activated'), true, 'Model in belonsTo relatioonship is decorated');
});
