import Ember from 'ember';
import DecoratorMixin from 'ember-clothier/model-mixin';

export default Ember.Object.extend(DecoratorMixin, {
  modelName: 'object',
  name: 'Ember Object record',
  description: 'Basic ember object model'
});
