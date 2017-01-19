var Backbone = require('backbone');
var user = require('../models/user');
var userCollection = require('../collections/users');
var userView = require('../views/user-view');
var headers = {
	'accept-encoding': 'gzip,deflate',
	'user-agent': 'YourUserAgent/0.0.1 +http://localhost:3000/' // a unique user agent is required
};
var discogs = require('../discogs');
var pageNumber = 1;
var searchTerm = '';
var allUsers = new userCollection;

var AppView = Backbone.View.extend({
	el: 'body',

	events: {
		"submit": "handleResults",
		"click a": "changePage",
	},

	initialize: function() {

	},

	handleResults: function(e) {
		e.preventDefault();

		var searchTerm = $("#user").val();
		var url = '/users/'+searchTerm;

		discogs(headers, url, function(err, data) {

			if ( data.hasOwnProperty("message") ) {
				$('#error').removeClass('hidden');
    			return;
			}

		  var user = allUsers.create({
				avatar: data.avatar_url,
				username: data.username,
				rank: data.rank,
				collectionTotal: data.num_collection,
				buyerRating: data.buyer_rating,
				sellerRating: data.seller_rating,
				releasesContributed: data.releases_contributed
		  });

			var view = new userView({model: user});
      var users = allUsers.models;
      console.log(users);

      if (users.length === 1 ) {
        $('#player1 img').attr('src', data.avatar_url);
        $('#player1').append(view.render().el);
      } else if ( users.length === 2 ) {
        $('#player2 img').attr('src', data.avatar_url);
        $('#player2').append(view.render().el);
        $('form').addClass('hidden');
        $('#battle').removeClass('hidden');
      } else {
        return;
      }

        // $('#users-list li .user').each(function (index) {
        //     $(this).append(view.render().el);
        //     console.log(this);
        // });

			  //$('#users-list').append(view.render().el);



	  // $.each(users, function(i, user) {
			// console.log(user.get('username'));
	  // });
		});
	},
});

module.exports = AppView;
