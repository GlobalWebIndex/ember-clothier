import Ember from 'ember';

export default Ember.Mixin.create({
  decorateCollection: function(collection, alias) {
    return this.clothier.createCollection(collection, alias);
  }
});
