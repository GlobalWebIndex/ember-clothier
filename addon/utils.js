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
export function _create (model, DecoratorNames) {
  let decoratedObject = model;
  const decorators = _getDecorators.call (this, model, DecoratorNames);

  if (Ember.isEmpty (decorators)) {
    Ember.Logger.error (`Clothier: Decorator was not found ${DecoratorNames}!`);
  }

  decorators.forEach((decorator) => {
    decoratedObject = decorator.create({ content: decoratedObject });
  });

  return decoratedObject;
}

/*
 * Create collection of decorators
 * @param collection[Array]
 * @param alias[String]
 * @return Array
 */
export function _createCollection (collection, decorators) {
  return Ember.A(collection.map ((model) => {
    return _create.call (this, model, decorators);
  }));
}

/*
 * Get defined decorators for object
 * @param model[Array/Object]
 * @param DecoratorNames[Array/String]
 * @return Array/Object
 */
export function _getDecorators (model, DecoratorNames) {
  DecoratorNames = Ember.makeArray(DecoratorNames);
  let decorators = [];

  DecoratorNames.forEach((name) => {
    let path = _getPath.call (this, model, name);
    decorators.push(this.container.lookupFactory(path));
  });

  return decorators;
}

/*
 * Get defined decorators for object
 * @param arguments[Array/Object]
 */
export function parseParams (args) {
  const params = Array.prototype.slice.call(args);
  const subject = params.shift();
  const DecoratorNames = params;

  return [subject, DecoratorNames];
}

/*
 * Decorate collection or Object
 * @param model[Array/Object]
 * @param DecoratorNames[Array/String]
 * @return Array/Object
 */
export function decorate (model, DecoratorNames) {
  if (Ember.isArray (model)) {
    return _createCollection.call (this, model, DecoratorNames);
  } else {
    return _create.call (this, model, DecoratorNames);
  }
}

/*
 * create computed decorator
 * @param attribute[String]
 * @param DecoratorNames[Array/String]
 * @return Object[Ember.computed]
 */
export function computed () {
  const [attribute, DecoratorNames] = parseParams(arguments);

  return Ember.computed (`${attribute}.@each`, attribute, function () {
    let model = this.get (attribute);
    return decorate.call (this, model, DecoratorNames);
  });
}

/*
 * create computed with setter
 * @param DecoratorNames[Array/String]
 * @return Object[Ember.computed]
 */
export function computedWithSetter (DecoratorNames) {
  return Ember.computed (function (attribute, value) {
    const chacheAttr = `_decorated${attribute}`;
    if (value) {
      this.set (chacheAttr, decorate.call (this, value, DecoratorNames));
    }

    return this.get (chacheAttr);
  });
}
