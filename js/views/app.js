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
			  $('#users-container').append(view.render().el);

	  			var users = allUsers.models;

	  // $.each(users, function(i, user) {
			// console.log(user.get('username'));
	  // });
	 

	  // var releaseTemplate = _.template('<li><%= artist %> - <%= title %></li>');
		// var paginationTemplate = _.template('<li><a href="#" class="page-number" id="<%= number %>"><%= number %></a></li>');
		// url = '/users/'+searchTerm+'/collection?per_page=25&page='+pageNumber.toString();
		});

		// discogs(headers, url, function(err, data) {
		//
		// 	var pages = data.pagination.pages;
		// 	var releases = data.releases;
	//
		// 	$.each(releases, function(i, release) {
		// 		$('#results').append(releaseTemplate({
		// 			artist: release.basic_information.artists[0].name,
		// 			title: release.basic_information.title
		// 		}));
		// 	});
	//
		// 	if ($('#pages').is(':empty')) {
		// 		for (i = 0; i < pages; i++) {
		// 			$('#pages').append(paginationTemplate({
		// 				number: i+1
		// 			}));
		// 		}
		// 		$('nav').removeClass('hidden');
		// 	}
		// 	$('#pages li a.active').removeClass('active');
		// 	$('#pages li a#'+pageNumber).addClass('active');
	//
		// });
	},

	// changePage: function(e) {
	// 	e.preventDefault();

	// 	if (e.currentTarget.id == 'prev') {
	// 		pageNumber = pageNumber -= 1;
	// 	} else if (e.currentTarget.id == 'next') {
	// 		pageNumber = pageNumber += 1;
	// 	} else if ($(e.currentTarget).hasClass('page-number')) {
	// 		pageNumber = parseInt(e.currentTarget.id);
	// 	}
	// 	this.handleResults(e);
	// }
});

module.exports = AppView;
