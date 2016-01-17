import Ember from 'ember';
import { decorate, computed } from './utils';

export default Ember.Mixin.create({
  /*
   * Create decorated collection/object
   * USAGE:

   var collection = this.store.find('modelName');
   return this.decorate(collection, 'decoratorName');
   */
  decorate (model, alias) {
    return decorate.call (this, model, alias);
  }
});

/*
 * Create computed decorator
 * USAGE:

 activatables: computeddecorate('model', 'activatable')
 */
export const computedDecorate = computed.bind(this);
