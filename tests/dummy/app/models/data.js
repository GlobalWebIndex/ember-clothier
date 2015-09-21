import DS from 'ember-data';
import DecoratorMixin from 'ember-clothier/model-mixin';

export default DS.Model.extend(DecoratorMixin, {
  name: DS.attr('string'),
  description: DS.attr('string')
});
