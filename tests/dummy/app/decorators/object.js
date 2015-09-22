import Ember from 'ember';
import ModelDecorator from 'ember-clothier/model-decorator';

export default ModelDecorator.extend({
  nameLength: Ember.computed('name', function() {
    return this.get('name').length;
  })
});
