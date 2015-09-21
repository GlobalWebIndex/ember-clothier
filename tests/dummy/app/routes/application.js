import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var createRecord = function() {
      return this.store.createRecord('data', {
        name: 'ember data record',
        description: 'description'
      });
    }.bind(this);

    var record = createRecord();

    var collection = Ember.A([createRecord(), createRecord()]);

    return Ember.RSVP.hash({
      record: record.decorate('activateble'),
      collection: this.modelDecorators.collection(collection, 'activatable')
    });
  }
});
