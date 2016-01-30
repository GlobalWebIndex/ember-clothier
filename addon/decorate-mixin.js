import Ember from 'ember';
import { decorate, computed, computedWithSetter } from './utils';

export default Ember.Mixin.create ({
  /*
   * Create decorated collection/object
   * USAGE:

   var collection = this.store.find ('modelName');
   return this.decorate (collection, 'decoratorName');
   */
  decorate (model, alias) {
    return decorate.call (this, model, alias);
  }
});

/*
 * Create computed decorator
 * USAGE:

 activatables: computedDecorate ('model', 'activatable')
 */
export const computedDecorate = computed.bind (this);

/*
 * Create computed decorator with setter support
 * Usage:

 activatables: computedDecorateWithSetter ('activatable')
 */
export const computedDecorateWithSetter = computedWithSetter.bind (this);
