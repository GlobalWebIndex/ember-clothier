import Ember from 'ember';
import { decorate } from './utils';

export default Ember.Mixin.create({
  /*
   * Create decorated collection/object
   * USAGE:

   var collection = this.store.find('modelName');
   return this.decorate(collection, 'decoratorName');
   */
  decorate(model, alias) {
    Ember.Logger.warn('route-mixin is depricated. Use imports from decorate-mixin instead! (ember-clothier/decorate-mixin)');
    return decorate.call(this, model, alias);
  }
});
