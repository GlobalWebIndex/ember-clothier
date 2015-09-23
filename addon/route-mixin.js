import Ember from 'ember';
import { create, createCollection } from './utils';

export default Ember.Mixin.create({
  /*
   * Get decorated collection
   * @param collection[Array] *required
   * @param alias[String]
   * @return Array
   * USAGE:

   // With default decorator:
   var collection = this.store.find('modelName');
   return this.decorateCollection(collection);

   // With specific decorator:
   var collection = this.store.find('modelName');
   return this.decorateCollection(collection, 'decoratorName');
   */
  decorateCollection: function(collection, alias) {
    return createCollection.bind(this)(collection, alias);
  },

  /*
   * get decorated model
   * @param model[Object] *required
   * @param alias[String]
   * @return Object
   * USAGE:

   // With default decorator:
   var collection = this.store.find('modelName');
   this.decorateModel(collection);

   // With specific decorator:
   var collection = this.store.find('modelName');
   return this.decorateModel(collection, 'decoratorName');
   */
  decorateModel: function(model, alias) {
    return create.bind(this)(model, alias);
  }
});
