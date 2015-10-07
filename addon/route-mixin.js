import Ember from 'ember';
import { decorate } from './utils';

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
  return Ember.computed(attribute + '.@each', attribute, function() {
    var subject = this.get(attribute);
    return decorate.bind(this)(subject, alias);
  });
}
