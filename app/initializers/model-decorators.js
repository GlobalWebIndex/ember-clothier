export default {
  name: 'model-decorators',

  initialize: function(container, app) {
    app.inject('route', 'modelDecorators', 'service:model-decorators');
    app.inject('model', 'modelDecorators', 'service:model-decorators');
  }
};
