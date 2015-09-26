import Ember from 'ember';

/*
 * get model name (key for default decorator)
 * @param model[Object]
 * @return String
 */
export function _getModelName(model) {
  var modelName = model._modelName || model.constructor.modelName;

  if (Ember.isEmpty(modelName)) {
    Ember.Logger.error('Clothier: Unknown model name key for ${modelName}!');
  }

  return modelName;
}

/*
 * generate lookup path
 * @param model[Object]
 * @param alias[String]
 * @return String
 */
export function _getPath(model, alias) {
  alias = alias || _getModelName(model);
  return 'decorator:' + alias;
}

/*
 * Create Decorator instance
 * @param model[Object]
 * @param alias[String]
 * @return Object
 */
export function create(model, alias) {
  var path = _getPath.bind(this)(model, alias);
  var Decorator = this.container.lookupFactory(path);

  if (Ember.isEmpty(Decorator)) {
    Ember.Logger.error('Clothier: Decorator was not found' + path + '!');
  }

  return Decorator.create({ content: model});
}

/*
 * Create collection of decorators
 * @param collection[Array]
 * @param alias[String]
 * @return Array
 */
export function createCollection(collection, alias) {
  return collection.map(function(model) {
    return create.bind(this)(model, alias);
  }.bind(this));
}
