var Backbone = require('backbone');
var user = require('../models/user');
var userCollection = require('../collections/users');

var UserView = Backbone.View.extend({
	tagName: 'ul',

	events: {

	},

  template: _.template($('#user-template').html()),

  render: function() {
			this.$el.html(this.template(this.model.attributes));
			return this; // enable chained calls
		},

		initialize: function() {

		}
});

module.exports = UserView;
