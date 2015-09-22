export default {
  name: 'clothier',

  initialize: function(container, app) {
    app.inject('route', 'modelDecorators', 'service:clothier');
    app.inject('model', 'modelDecorators', 'service:clothier');
  }
};
