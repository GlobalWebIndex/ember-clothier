import Ember from 'ember';

const observer = Ember.observer;
const on = Ember.on;

export default Ember.ObjectProxy.extend({
  /*
   * Add method from content
   * @param method[function]
   * @return function
   */
  _addMethod(method){
    this[method] = function() {
      var content = this.get('content');

      if (Ember.isEmpty(content[method])) {
        return;
      }

      return content[method].apply(content, arguments);
    };
  },

  /*
   * Setup method proxying
   */
  _setupMethods: on('init', observer('content', function(){
    var content = this.get('content');

    if (Ember.isEmpty(content)) { return; }

    for (let method in content) {
      if(Ember.typeOf(content[method]) === "function" && Ember.isEmpty(this[method])) {
        this._addMethod(method);
      }
    }
  })),

  /*
   * Setup ember data relationship keys
   */
  _setupEmberData: on('init', observer('content', function() {
    var content = this.get('content');

    if (Ember.isEmpty(content)) { return; }

    this._internalModel = content._internalModel;
  }))
});
