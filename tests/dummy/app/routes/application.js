import Ember from 'ember';
import DecorateMixin, { computedDecorate } from 'ember-clothier/decorate-mixin';

export default Ember.Route.extend(DecorateMixin, {
  model() {
    const createRecord = () => {
      return this.store.createRecord('data', {
        name: 'ember data record',
        description: 'description'
      });
    };

    var record = createRecord();
    var object = this.container.lookup('model:object');
    var collection = Ember.A([createRecord(), createRecord()]);

    return Ember.RSVP.hash({
      record: record.decorate('active'),
      object: object.decorate(),
      collection: this.decorate(collection)
    });
  }
});
