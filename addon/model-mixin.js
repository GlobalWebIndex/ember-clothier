import Ember from 'ember';
import { decorate, computed } from './utils';

export default Ember.Mixin.create({
  /*
   * decorate model
   * @param alias[String]
   * @return Object
   * USAGE:

   var record = this.store.find('modelName', id);
   return record.decorate('decoratorName');
   */
  decorate (alias) {
    return decorate.call (this, this, alias);
  }
});

/*
 * Decorate relationship
 * USAGE:

childrens: DS.hasmany('childrens'),
decoratedChildrens: decorateHasMany('childrens', 'decoratorName')
*/
export const decorateRelation = computed.bind (this);
