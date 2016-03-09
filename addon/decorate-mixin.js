import Ember from 'ember';
import { decorate, computed, computedWithSetter, parseParams } from './utils';

export default Ember.Mixin.create ({
  /*
   * Create decorated collection/object
   * USAGE:

   var collection = this.store.find('modelName');
   return this.decorate(collection, 'decoratorName');
   */
  decorate () {
    let [model, decorator_names] = parseParams(arguments);

    return decorate.call (this, model, decorator_names);
  }
});

/*
 * Create computed decorator
 * USAGE:

 activatables: computedDecorate ('model', 'activatable')
 */
export const computedDecorate = computed.bind (this);

/*
 * Create decorator factory
 * Usage:

 activatables: decoratorFactory('activatable')
 */
export const decoratorFactory = computedWithSetter.bind (this);
