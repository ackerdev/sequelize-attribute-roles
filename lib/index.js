var Sequelize = require('sequelize'),
    _ = Sequelize.Utils._;

module.exports = function(target) {
  if (target instanceof Sequelize.Model) {
    // Model
    createHook(target);
  } else {
    // Sequelize instance
    target.afterDefine(createHook);
  }
}

function createHook(model) {
   model.hook('beforeFindAfterOptions', function(options) {
    if (options.role) {
      var role = options.role,
          attributes = options.attributes,
          includes = options.include;

      options.attributes = attrAccessible(model, role, attributes);
      cleanIncludesRecursive(includes, role);
    }
  });
}

function attrAccessible(model, role, attributes) {
  var attrsToReject = attrProtected(model, role);
  return rejectAttributes(attributes, attrsToReject);
}

function attrProtected(model, role) {
  return _.keys(_.pick(model.attributes, function(attr, name) {
    return !_.isUndefined(attr.access) && ( attr.access === false || attr.access[role] === false );
  }));
}

function rejectAttributes(attributes, attrsToRemove) {
  return _.reject(attributes, function(attr) {
    if (_.isArray(attr)) {
      attr = attr[1];
    }

    return _.includes(attrsToRemove, attr);
  });
}

function cleanIncludesRecursive(includes, role) {
  _.each(includes, function(include) {
    var model = include.model,
        attributes = include.attributes;

    include.attributes = attrAccessible(model, role, attributes);

    if (include.include) {
      cleanIncludesRecursive(include.include, role);
    }
  });
}