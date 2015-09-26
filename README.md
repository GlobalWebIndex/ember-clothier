# Ember Clothier
Clothier adds an **object-orientated logic** of presentation and state management for your data to your Ember application.

Clothier is designed for decorating your data models with presentation logic
(which otherwise might be tangled up into procedural helpers)
and data based contextual state of your app.
It also help you organise and test this layer of your app more effectively.

**Chose your own data library. Clothier supports everything from Ember Data to plain Ember.Object instances.**

## Why?
There are many cases were you need to keep some additional logic aroud your data models in your ambitious web application.
As Ember developers we facing this every day.
There are some examples:

### Object Oriented Helpers
Ember come with support for helpers out of the box.
The problem of this solution is that these helpers are procedural and it is not easy to organise and using them well.
With Clothier you can define Class that wraps your model around so you can define method based helpers around your data.
Isn't it cool? See example:

**Default implementation using helpers:**

```javascript
// helpers/format-date.js
import Ember from 'ember';

export function formatDate(date) {
  return moment(date).format('Do MMMM YYYY');
}

export default Ember.Handlebars.makeBoundHelper(formatDate);
```

```javascript
// models/model-name.js
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('name')
});
```

```javascript
// routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('modelName', params.modelId);
  }
});
```

```handlebars
{{format-date model.createdOn}}
```

**Implementation using Clothier:**

```javascript
// decorators/date.js
import ModelDecorator from 'ember-clothier/model-decorator';

export default ModelDecorator.extend({
  formatedDate: function() {
    return moment(this.get(date)).format('Do MMMM YYYY');
  }.property('createdOn')
});
```

```javascript
// models/model-name.js
import DS from 'ember-data';
import ModelMixin from 'ember-clothier/model-mixin';

export default DS.Model.extend(ModelMixin, {
  name: DS.attr('name')
});
```

```javascript
// routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('modelName', params.modelId).decorate('date');
  }
});
```

```handlebars
{{model.formatedDate}}
```

### Holding Contextual State
The other case is even more difficult. Say we need to implement some filtering logic in our app. We have some models
and we want to manage which of these models are `selected` around our app so we can reflect this state in our components.
Without Clothier, this should be done directly on models by defining some state attribute which holds this state.
But what if you need to handle states for one model in more than one context?
For example we want to have one state of model that holds `isActive` in filter context and other one that handles `isMarkedForDelete`.
You can end up with pretty big mess of state logic on your models which have nothing to do with model itself at all.
With Clothier this is all easy. Just define `Decorator` class for each case and you're done. Here is simple example:

```javascript
// decorators/activatable.js
import ModelDecorator from 'ember-clothier/model-decorator';

export default ModelDecorator.extend({
  isActive: false, // default value is false
  toggleActive: function() {
    this.toggleProperty('isActive');
  }
});
```

```javascript
// models/model-name.js
import DS from 'ember-data';
import ModelMixin from 'ember-clothier/model-mixin'; // in this case model mixin is not necesary, but it's recommended

export default DS.Model.extend(ModelMixin, {
  name: DS.attr('name')
});
```

```javascript
// routes/application.js
import Ember from 'ember';
import DecoratorMixin from 'ember-clothier/route-mixin';

export default Ember.Route.extend(DecoratorMixin, {
  model: function() {
    return this.decorateCollection(this.store.find('modelName'));
  }
})
```

```javascript
// view/application.js
import Ember from 'ember';

export default Ember.View.extend({
  activeItems: function() {
    return this.get('model').filterProperty('isActive', true);
  }.property('model.@each.isActive'),
  actions: {
    clickOnItem: function(item) {
      item.toggleActive();
    }
  }
});
```

```handlebars
{{#each model as |item|}}
  <div {{action 'clickOnItem' item}} class={{if item.isActive 'active' 'inactive'}}>
    {{item.name}}
  </div>
{{/each}}

Active items:<br>
{{#each activeItems as |activeItem|}}
  {{actveItem.name}}<br>
{{/each}}
```

## Installation

Install via npm:

```shell
npm install --save-dev embert-clothier
```

## Compatibility
This plugin is compatible with various version of Ember and Ember Data.

| Ember Version          | compatibility   |
| ---------------        | --------------- |
| Ember 1.10.x and older | no              |
| Ember 1.11.x           | OK              |
| Ember 1.12.x           | OK              |
| Ember 1.13.x           | OK              |
| Ember 2.x.x            | no              |

**Ember 2 compatibility comming soon!**

| Ember Data version                | compatibility |
| ------------------                | ------------- |
| Ember Data 1.0.0-beta18 and older | unknown       |
| Ember Data 1.0.0-beta19.x         | OK            |
| Ember Data 1.13.x                 | OK            |
| Ember Data 2.x.x                  | unknown       |

## Writing decorators
Put your decorators in `app/decorators` directory.
Here is example of basic decorator:

``` javascript
import ModelDecorator from 'ember-clothier/model-decorator';

export default ModelDecorator.extend({

  // decorate model with full name attribute
  fullName: function() {
    return this.get('firstName') + this.get('lastName');
  }.property('firstName', 'lastName'),

  // handle state in menu
  isActiveInMenu: false,

  changeInMenu: function() {
    this.toggleProperty('isActiveInMenu');
  }
});
```

## Aliases and Naming Conventions
If you do not specify decorator name when decorating object default decorator will be used.
With Ember Data this is done by using modelName key provided in `DS.Model` instance.
If you are not using Ember Data you have to specify `_modelName` attribute in your model.
The `_modelName` attribute should be also use for overwriting default name with Ember Data.

project structure:
```
app/
  |- decorators
  |   |- user.js
  |   |- menu-item.js
  |- models
  |   |- user.js
  |- routes
      |- application.js
```

```javascript
// models/user.js
import Ember from 'ember';
import DecoratorMixin from 'ember-clothier/model-mixin';

export default Ember.Object.extend(DecoratorMixin, {
  _modelName: 'user', // this.decorate() will lookup for user decorator
  name: ''
});
```

Then in your route:
```javascript
import Ember from 'ember';
import UserModel from '../models/user';

export default Ember.Route.extend({
  model: function() {
    return UserModel.create({ name: 'Tom Dale' });
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('user', model.decorate()); // RETURNS MODEL DECORATED WITH USER DECORATOR
    controller.set('menuItem', model.decorate('menu-item')); // RETURNS MODEL DECORATED WITH MENU-ITEM DECORATOR
  }
});
```

## Decorating Objects and Collections
With Clothier it is simple to decorate both objects and collections.
There are two basic mixins which implements methods for creating decorators instances.
`ModelMixin` implements `decorate()` method for decorating model instances and helpers for decorating its relationships (see below).
`RouteMixin` implements `decorateModel()` and `decorateCollection()` methods for both **objects and collections**.
The difference is that Route methods takes two arguments where first one is model or collection of instances.
See Api Documentation for more informations.

## Decorating relationships
`ModelMixin` comes with two additional helper functions for decorating model relationships.
This helpers takes two arguments ­ *relationKey* and *decoratorName* and return `Ember.computed` which returns decorated relationship.
See this simple example:

```javascript
import DS from 'ember-data';
import ModelMixin, { decorateBelongsTo, decorateHasMany } from 'ember-cothier/model-mixin';

export default DS.Model.extend({
  name: DS.attr('string'),
  author: DS.belongsTo('user'),
  categories: DS.hasMany('categories'),

  // decorated relationships
  decoratedAuthor: decorateBelongsTo('author'),
  decoratedCategories: decorateHasMany('categories')
});
```

**Helpers for decoration relationships works also without ember data.**
The only thing which is expected is that first argument is name of model attribute which holds default model/collection in relationship.
You can easily use this the with plain `Ember.Object` models or any other Model implementation.

## Api Documentation

| Class/Helper      | Method             | Import from | Arguments                                     | Return                     |
| ------------      | ------             | ----------- | ---------                                     | ------                     |
| RouteMixin        |                    | route-mixin |                                               |                            |
|                   | decorateModel      |             | modelInstance[Object], decoratorAlias[String] | decoratedModel[Object]     |
|                   | decorateCollection |             | collection[Array], decoratorAlias[String]     | decoratedCollection[Array] |
| ModelMixin        |                    | model-mixin |                                               |                            |
|                   | decorate           |             | decoratorAlias[String]                        | decoratedModel[Object]     |
| decorateBelongsTo |                    | model-mixin | relationKey[String], decoratorAlias[String]   | Ember.computed             |
| decorateHasMany   |                    | model-mixin | relationKey[String], decoratorAlias[String]   | Ember.computed             |

**Examples of imports:**
```javascript
// RouteMixin
import DecoratorRouteMixin from 'ember-clothier/route-mixin';

// ModelaMixin
import DecoratorModelMixin from 'ember-clothier/model-mixin';

// decorateBelongTo
import { decorateBelongsTo } from 'ember-clothier/model-mixin';

// decorateHasMany
import { decorateHasMany } from 'ember-clothier/model-mixin';
```

## Building from source
You can build this addon from source by cloning repository with git.

Dependencies:
- PhantomJS 2.0.0

clone source:
```shell
$ git clone git://github.com/globalwebindex/ember-clothier.git`
```

install dependencies:
```shell
$ npm install
```

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests
NPM test uses ember-try for testing addon against multiple versions of Ember and Ember Data.

* `npm test`
* `ember test`
* `ember test --server`

## Building

* `ember build`
