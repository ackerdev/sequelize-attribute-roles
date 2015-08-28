# Sequelize Attribute Roles

Attribute blacklisting with roles for Sequelize.

Requires Sequelize `>=3.0.0`

Inspired by [ssacl-attribute-roles](https://github.com/mickhansen/ssacl-attribute-roles)

# Install

```sh
npm install --save sequelize-attribute-roles
```

# What does it do?

sequelize-attribute-roles adds a hook to sequelize models that allows it to intercept the attributes used in query when retrieving the model from the database. It checks the original model's attribute definitions for the 'access' key, which can be a boolean or object containing keys that correspond to your roles, with a boolean value to designate whether or not that role should be allowed to view this attribute.

You can enable guarding for all models of a Sequelize instance, or for individual models.

# Caveats

Currently, sequelize-attribute-roles only prevents the attributes from being retrieved and viewed, it does **NOT** prevent these attributes from being altered.

It does not currently prevent foreign key attributes from being retrieved.

It does not support whitelisting yet, and will only hide attributes that have access control defined.

To receive the benefits of attribute guarding, you **MUST** specify a role in your query options. Otherwise, all attributes will be allowed through.

# Usage

```js
var sequelizeAttributeRoles = require('sequelize-attribute-roles'),
    sequelize = new Sequelize();

// Guard attributes on all models of a Sequelize instance
sequelizeAttributeRoles(sequelize);

var User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    access: {
      admin: true,
      self: true
    }
  },
  password: {
    type: Sequelize.STRING
    access: false
  }
});

// Guard attributes of an individual model
sequelizeAttributeRoles(User);

user.find() // No role specified, will include all attributes
user.find({role: 'admin'}) // Will include email but not password
user.find({role: 'self'}) // Will include email but not password
user.find({role: 'other'}) // Will not include email or password
```