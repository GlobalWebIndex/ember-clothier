import Ember from 'ember';

/*
 * generate lookup path
 * @param model[Object]
 * @param alias[String]
 * @return String
 */
function getPath(model, alias) {
  alias = alias || model._clothierModelName;
  return 'decorator:%@'.fmt(alias);
};

/*
 * Create Decorator instance
 * @param model[Object]
 * @param alias[String]
 * @return Object
 */
export function create(model, alias) {
  var path = getPath.bind(this)(model, alias);
  var Decorator = this.container.lookupFactory(path);

  if (Ember.isEmpty(Decorator)) {
    Ember.Logger.error('Decorator was not found %@!'.fmt(path));
  };

  return Decorator.create({ content: model});
};

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
};
