import Ember from 'ember';
import DecoratorMixin from 'ember-clothier/route-mixin';

export default Ember.Route.extend(DecoratorMixin, {
  model: function() {
    var createRecord = function() {
      return this.store.createRecord('data', {
        name: 'ember data record',
        description: 'description'
      });
    }.bind(this);

    var record = createRecord();
    var object = this.container.lookup('model:object');
    var collection = Ember.A([createRecord(), createRecord()]);

    return Ember.RSVP.hash({
      record: record.decorate('active'),
      object: object.decorate(),
      collection: this.decorateCollection(collection)
    });
  }
});
