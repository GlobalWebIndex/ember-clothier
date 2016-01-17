import Ember from 'ember';

/*
 * get model name (key for default decorator)
 * @param model[Object]
 * @return String
 */
export function _getModelName(model) {
  var modelName = model._modelName || model.constructor.modelName;

  if (Ember.isEmpty (modelName)) {
    Ember.Logger.error (`Clothier: Unknown model name key for ${modelName}!`);
  }

  return modelName;
}

/*
 * generate lookup path
 * @param model[Object]
 * @param alias[String]
 * @return String
 */
export function _getPath (model, alias) {
  alias = alias || _getModelName (model);
  return `decorator:${alias}`;
}

/*
 * Create Decorator instance
 * @param model[Object]
 * @param alias[String]
 * @return Object
 */
export function _create (model, alias) {
  var path = _getPath.call (this, model, alias);
  var Decorator = this.container.lookupFactory (path);

  if (Ember.isEmpty (Decorator)) {
    Ember.Logger.error (`Clothier: Decorator was not found ${path}!`);
  }

  return Decorator.create ({ content: model});
}

/*
 * Create collection of decorators
 * @param collection[Array]
 * @param alias[String]
 * @return Array
 */
export function _createCollection (collection, alias) {
  return Ember.A(collection.map ((model) => {
    return _create.call (this, model, alias);
  }));
}

/*
 * Decorate collection or Object
 * @param subject[Array/Object]
 * @param alias[String]
 * @return Array/Object
 */
export function decorate (subject, alias) {
  if (Ember.isArray (subject)) {
    return _createCollection.call (this, subject, alias);
  } else {
    return _create.call (this, subject, alias);
  }
}

/*
 * create computed decorator
 * @param attribute[String]
 * @param alias[String]
 * @return Object/Array
 */
export function computed (attribute, alias) {
  return Ember.computed (`${attribute}.@each`, attribute, function() {
    var subject = this.get (attribute);
    return decorate.call (this, subject, alias);
  });
}
