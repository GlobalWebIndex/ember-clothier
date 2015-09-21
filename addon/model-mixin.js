import Ember from 'ember';

export default Ember.Mixin.create({
  decorate: function(alias) {
    return this.modelDecorators.create(this, alias);
  }
});
