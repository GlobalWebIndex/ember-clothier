import Ember from 'ember';

export default Ember.Service.extend({
  _getPath: function(model, alias) {
    var aliasPath = alias ? '/%@'.fmt(alias) : '';
    return 'decorator:%@'.fmt(model._clothierModelName) + aliasPath;
  },

  create: function(model, alias) {
    var path = this._getPath(model, alias)
    var Decorator = this.container.lookupFactory(path);

    if (Ember.isEmpty(Decorator)) {
      Ember.Logger.error('Decorator was not found %@! Returning plain model instead'.fmt(path));
      return model;
    };
    return Decorator.create({ content: model});
  },

  createCollection: function(collection, alias) {
    return collection.map(function(model) {
      return this.create(model, alias);
    }.bind(this));
  }
});
