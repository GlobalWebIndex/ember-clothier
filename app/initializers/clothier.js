export default {
  name: 'clothier',

  initialize: function(container, app) {
    app.inject('route', 'clothier', 'service:clothier');
    app.inject('controller', 'clothier', 'service:clothier');
    app.inject('model', 'clothier', 'service:clothier');
  }
};
