import Ember from 'ember';

export default Ember.Mixin.create({
  _initClothier: Ember.on('init', function() {
    this._clothierModelName = this.constructor.modelName || this.modelName;
    if (!this._validateClothier()) {
      Ember.Logger.warn('Clothier: Model name is unknown!');
    }
  }),

  _validateClothier: function() {
    return !Ember.isEmpty(this._clothierModelName);
  },

  decorate: function(alias) {
    if (this._validateClothier()) {
      return this.clothier.create(this, alias);
    } else {
      Ember.Logger.error('Clothier: Model name is unknown! Returning plain model instance!');
      return this;
    }
  },

  decorateHasMany: function(collectionName, alias) {
    var collection = this.get(collectionName);
    return this.clothier.createCollection(collection, alias);
  },

  decorateBelongsTo: function(modelName, alias) {
    var model = this.get(modelName);
    return this.clothier.create(model, alias);
  }
});
