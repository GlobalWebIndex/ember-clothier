import { module, test } from 'qunit';
import Decorator from 'ember-clothier/model-decorator';

module('ember-clothier/model-decorator');

test('can create instance', function(assert) {
  var decorator = Decorator.create();

  assert.equal(!!decorator, true);
  assert.equal(decorator.get('content'), null, 'have no content by default');
});

