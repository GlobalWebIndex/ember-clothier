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
  decorate(alias) {
    return decorate.call(this, this, alias);
  }
});

/*
 * Decorate relationship
 * USAGE:

childrens: DS.hasmany('childrens'),
decoratedChildrens: decorateHasMany('childrens', 'decoratorName')
*/
export const decorateRelation = computed.bind(this);

/*
 * Decorate has many relation
 * USAGE:

childrens: DS.hasmany('childrens'),
decoratedChildrens: decorateHasMany('childrens', 'decoratorName')
*/
export const decorateHasMany = function(attribute, alias) {
  Ember.Logger.warn('decorateHasMany is now depricated. Please use decorateRelation instead!');
  return decorateRelation.call(this, attribute, alias);
};

/*
 * Decorate belongs to relation
 * USAGE:

childrens: DS.belongsTo('parent'),
decoratedParent: decoraBelonsTo('parent', 'decoratorName')
*/
export const decorateBelongsTo = function(attribute, alias) {
  Ember.Logger.warn('decorateBelongsTo is now depricated. Please use decorateRelation instead!');
  return decorateRelation.call(this, attribute, alias);
};
