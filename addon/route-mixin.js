import Ember from 'ember';
import { decorate, createCollection } from './utils';

export default Ember.Mixin.create({
  /*
   * Get decorated collection/object
   * @param model[Array/Object] *required
   * @param alias[String]
   * @return Array/Object
   * USAGE:

   // With default decorator:
   var collection = this.store.find('modelName');
   return this.decorate(collection);

   // With specific decorator:
   var collection = this.store.find('modelName');
   return this.decorate(collection, 'decoratorName');
   */
  decorate(model, alias) {
    return decorate.bind(this)(model, alias);
  }
});

export function computedDecorate(attribute, alias) {
  return Ember.computed(attribute + '.@each', function() {
    var collection = this.get(attribute);
    return createCollection.bind(this)(collection, alias);
  });
}
