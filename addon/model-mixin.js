import Ember from 'ember';
import { create, createCollection } from './utils';

export default Ember.Mixin.create({
  /*
   * decorate model
   * @param alias[String]
   * @return Object
   * USAGE:

   // With default decorator:
   var record = this.store.find('modelName', id);
   return record.decorate();

   // With specific decorator:
   var record = this.store.find('modelName', id);
   return record.decorate('decoratorName');
  */
  decorate: function(alias) {
    return create.bind(this)(this, alias);
  },

  decorateHasMany: function(collectionName, alias) {
    var collection = this.get(collectionName);
    return createCollection.bind(this)(collection, alias);
  },

  decorateBelongsTo: function(modelName, alias) {
    var model = this.get(modelName);
    return create.bind(this)(model, alias);
  }
});
