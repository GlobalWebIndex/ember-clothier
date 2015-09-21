import Ember from 'ember';

export default Ember.Service.extend({
  getPath: function(model, alias) {
    var aliasPath = alias ? ':%@'.fmt(alias) : '';
    return 'decorator:%@'.fmt(model.constructor.modelName) + aliasPath;
  },

  create: function(model, alias) {
    var path = this.getPath(model, alias)
    var Decorator = this.container.lookupFactory(path);
    return Decorator.create({ content: model});
  },

  collection: function(collection, alias) {
    return collection.map(function(model) {
      return this.create(model, alias);
    }.bind(this));
  }
});
