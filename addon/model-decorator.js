import Ember from 'ember';

const o = Ember.observer;
const on = Ember.on;

var Decorator = Ember.ObjectProxy.extend({
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

      return content[method].apply(this, arguments);
    };
  },

  /*
   * Setup method proxying
   */
  _setupMethods: on('init', o('content', function(){
    var content = this.get('content');

    if (Ember.isEmpty(content)) { return; }

    for (var method in content) {
      if(Ember.typeOf(content[method]) === "function" && Ember.isEmpty(this[method])) {
         this._addMethod(method);
      }
    }
  }))
});

export default Decorator;
