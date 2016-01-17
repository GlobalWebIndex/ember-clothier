import Ember from 'ember';
import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';

module('ember-clothier/model-decorator');

test('can create instance', function (assert) {
  let decorator = Decorator.create();

  assert.equal(!!decorator, true);
  assert.equal(decorator.get('content'), null, 'have no content by default');
});

test('method are proxyed to content', function (assert) {

  let model = Ember.Object.create({
    name: 'Petr',

    sayHi() {
      return 'Hi, ' + this.get('name') + '!';
    },

    iam() {
      return 'model';
    }
  });

  let decoratedModel = Decorator.create({
    content: model,

    iam() {
      return 'decorator';
    }
  });

  assert.equal(decoratedModel.sayHi(), 'Hi, Petr!', 'Model\'s method is accesible');
  assert.equal(decoratedModel.iam(), 'decorator', 'Decorator can overwrite model\'s method');

  Ember.run(() => {
    decoratedModel.set('name', 'Zdenko');
  });

  assert.equal(decoratedModel.get('name'), 'Zdenko', 'Object property should be set');
  assert.equal(decoratedModel.get('content.name'), 'Zdenko', 'Setter is proxied to model');
});
