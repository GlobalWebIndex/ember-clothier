# Ember Clothier
[![Build Status](https://travis-ci.org/GlobalWebIndex/ember-clothier.svg?branch=master)](https://travis-ci.org/GlobalWebIndex/ember-clothier)
Docker: [![wercker status](https://app.wercker.com/status/409c0ee85a54140c6f3e37c28237bc28/s/master "wercker status")](https://app.wercker.com/project/bykey/409c0ee85a54140c6f3e37c28237bc28)
Windows: [![Build status](https://ci.appveyor.com/api/projects/status/3y37ea08jxpbw4ca/branch/master?svg=true)](https://ci.appveyor.com/project/turboMaCk/ember-clothier/branch/master)
[![Ember Observer Score](http://emberobserver.com/badges/ember-clothier.svg)](http://emberobserver.com/addons/ember-clothier)
[![Code Climate](https://codeclimate.com/github/GlobalWebIndex/ember-clothier/badges/gpa.svg)](https://codeclimate.com/github/GlobalWebIndex/ember-clothier)

Clothier adds an **object-orientated logic** for presentation and state management of your data to your Ember application.

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

export default Ember.Helper.helper(formatDate);
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
  model(params) {
    return this.store.findRecord('modelName', params.modelId);
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
  formatedDate: Ember.computed('createdOn', function() {
    return moment(this.get(date)).format('Do MMMM YYYY');
  })
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
  model(params) {
    return this.store.findRecord('modelName', params.modelId).decorate('date');
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
  toggleActive() {
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

export default Ember.Route.extend({
  model() {
    return this.store.findRecord('modelName');
  }
})
```

```javascript
// view/application.js
import Ember from 'ember';
import { computedDecorateWithSetter } from 'ember-clothier/decorate-mixin';

export default Ember.View.extend({
  model: computedDecorateWithSetter('activatable'),

  activeItems: Ember.computed('model.@each.isActive', function() {
    return this.get('activatables').filterProperty('isActive', true);
  }),

  actions: {
    clickOnItem(item) {
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
  {{activeItem.name}}<br>
{{/each}}
```

## Installation

Install via npm:

```shell
npm install --save-dev ember-clothier
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

**Ember 2 compatibility coming soon!**

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
  fullName: Ember.computed('firstName', 'lastName', function() {
    return this.get('firstName') + this.get('lastName');
  }),

  // handle state in menu
  isActiveInMenu: false,

  changeInMenu() {
    this.toggleProperty('isActiveInMenu');
  }
});
```

### Decorators support
Decorators behave like default `Ember.ObjectProxy` but they also support proxing to methods of orginal Object.
What this means? Basicaly you can call model instance methods on decorator instance and they will be propely delegate to original model.
If you define method with some name on decorator this proxy will be overwritten so both methods will be available on decorator instance.
`decorator.method()` calls method defined on decorator where `decorator.get('content').method()` call original metod on model instance.
Other feature which decorators has out of the box is proxy to `ember-data` meta so even decorator instances should be passed into ember-data relations.

### Aliases and Naming Conventions
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
  model() {
    return UserModel.create({ name: 'Tom Dale' });
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('user', model.decorate()); // RETURNS MODEL DECORATED WITH USER DECORATOR
    controller.set('menuItem', model.decorate('menu-item')); // RETURNS MODEL DECORATED WITH MENU-ITEM DECORATOR
  }
});
```

### Decorating relationships
`ModelMixin` comes with additional helper function for decorating model relationships.
This helper takes two arguments ­ *relationKey* and *decoratorAlias*(name of decorator) and return `Ember.computed` which returns decorated relationship.
See this simple example:

```javascript
import DS from 'ember-data';
import ModelMixin, { decorateRelation } from 'ember-clothier/model-mixin';

export default DS.Model.extend({
  name: DS.attr('string'),
  author: DS.belongsTo('user'),
  categories: DS.hasMany('categories'),

  // decorated relationships
  searchableAuthor: decorateRelation('author', 'searchable'),
  searchableCategories: decorateRelation('categories', 'searchable')
});
```

**Helpers for decoration relationships works also without ember data.**
The only thing which is expected is that first argument is name of model attribute which holds default model/collection in relationship.
You can easily use this the with plain `Ember.Object` models or any other Model implementation.


## Decorating Objects and Collections
With Clothier it is simple to decorate both objects and collections.
There are two basic mixins which implements methods for creating decorators instances.
`ModelMixin` implements `decorate()` method for decorating model instances and helper for decorating its relationships.
`DecorateMixin` implements `decorate()` method for decorating both **objects and collections** and helper for creating computed property for both (see below).
The difference is that Decorate methods takes two arguments where first one is model or collection and second one is alias (name) of decorator.
See Api Documentation for more informations.

### Computed Decorate
`DecorateMixin` comes with additional helper functions for creating computed property for decorating attributes.

#### computedDecorate
This function takes two arguments ­ **attributeName** and **decoratorAlias** (decorator name) and returns `Ember.computed` which returns decorated attribute.
This property is recomputed every-time original property is changed.
See this simple example:

```javascript
import Ember from 'ember';
import { computedDecorate } from 'ember-clothier/decorate-mixin';

export defualt Ember.Component.extend({
  // this property is bind from parrent component
  content: [],
  searchables: computedDecorate ('content', 'searchable')
});
```

### Computed Decorate with Setter
This function takes one argumnet **decoratorAlias** (decorator name) and returns `Ember.computed` which return decorated attribute.
This property is recomputed every-time you call `set` on this property. It returns previous value when you call `get` on it.
Example code:

```javascript
import Ember from 'ember';
import { computedDecorateWithSetter } from 'ember-clothier/decorate-mixin';

export default Ember.Component.extend({
  content: computedDecorateWithSetter ('searchable')
});

then you can bind or set any property to `content` and it will be atomatically decorated with `searchable` decorator.

## Api Documentation

| Class/Helper               | Method   | Import from    | Arguments                                     | Return                 |
| ------------               | ------   | -----------    | ---------                                     | ------                 |
| RouteMixin                 |          | decorate-mixin |                                               |                        |
|                            | decorate |                | subject[Array/Object], decoratorAlias[String] | decoratedModel[Object] |
| computedDecorate           |          | decorate-mixin | attribute[String], decoratorAlias[String]     | Ember.computed         |
| computedDecorateWithSetter |          | decorate-mixin | decoratorAlias[String]                        | Ember.computed         |
| ModelMixin                 |          | model-mixin    |                                               |                        |
|                            | decorate |                | decoratorAlias[String]                        | decoratedModel[Object] |
| decorateRelation           |          | model-mixin    | relationKey[String], decoratorAlias[String]   | Ember.computed         |

**Examples of imports:**
```javascript
// DecorateMixin
import DecorateMixin from 'ember-clothier/decorate-mixin';

// computedDecorate
import { computedDecorate } from 'ember-clothier/decorate-mixin';

// computedDecorateWithSetter
import { computedDecorateWithSetter } from 'ember-clothier/decorate-mixin';

// ModelMixin
import DecorateModelMixin from 'ember-clothier/model-mixin';

// decorateBelongsTo
import { decorateBelongsTo } from 'ember-clothier/model-mixin';

// decorateHasMany
import { decorateHasMany } from 'ember-clothier/model-mixin';
```

## Changelog
See [CHANGELOG.md](CHANGELOG.md)

## Building from source
You can build this addon from source by cloning repository with git.

Dependencies:
- PhantomJS 2.0.0

clone source:
```shell
$ git clone git://github.com/globalwebindex/ember-clothier.git
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

## About GlobalWebIndex

![globalwebindex](https://pbs.twimg.com/profile_images/468332770624679937/wd2TMi0i_400x400.png)

Ember Clothier is maintained by GlobalWebIndex Ltd.

See more about us at [www.globalwebindex.net](https://www.globalwebindex.net).
