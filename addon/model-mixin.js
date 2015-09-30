import Ember from 'ember';
import { create, createCollection } from './utils';

const c = Ember.computed;

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
  }
});

/*
 * Decorate record in hasMany relation
 * @param collcetionKey[String]
 * @param alias[String]
 * @return Array
 * Usage:

 // with default decorator:
 childrens: DS.hasmany('childrens'),
 decoratedChildrens: this.decorateHasMany('childrens')

 // with specified decorator:
 childrens: DS.hasmany('childrens'),
 decoratedChildrens: decorateHasMany('childrens', 'decoratorName')
*/
export function decorateHasMany(collectionKey, alias) {
  return c(collectionKey + '.@each', function() {
    var collection = this.get(collectionKey);
    return createCollection.bind(this)(collection, alias);
  });
}

/*
 * Decorate record in belongsTo relation
 * @param modelName[String]
 * @param alias[String]
 * @return Object
 * USAGE:

 // with default decorator:
 childrens: DS.belongsTo('parent'),
 decoratedParent: this.decorateBelongsTo('parent')

 // with specified decorator:
 childrens: DS.belongsTo('parent'),
 decoratedParent: decoraBelonsTo('parent', 'decoratorName')
*/
export function decorateBelongsTo(modelName, alias) {
  return c(modelName, function() {
    var model = this.get(modelName);
    return create.bind(this)(model, alias);
  });
}
