var Backbone = require('backbone');
var user = require('../models/user');
var userView = require('../views/user-view');

var Users = Backbone.Collection.extend({
  model: user,
  url: '/'
});

module.exports = Users;
