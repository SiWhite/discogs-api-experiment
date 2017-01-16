var Backbone = require('backbone');
var user = require('../models/user');
var userCollection = require('../collections/users');
var userView = require('../views/user-view');
var headers = {
	'accept-encoding': 'gzip,deflate',
	'user-agent': 'YourUserAgent/0.0.1 +http://localhost:3000/' // a unique user agent is required
};
var discogs = require('../discogs');
var url = '';
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
		$('#results').html('');
		searchTerm = $("#user").val();
    var userTemplate = _.template('<div class="user clearfix" data-username="<%= username %>">\
                                    <img src="<%= avatar %>" width="150" />\
                                    <div class="user-data">\
                                      <ul>\
                                        <li>Username: <%= username %></li>\
                                        <li>Rank: <%= rank %></li>\
                                        <li>Collection Total: <%= collectionTotal %></li>\
                                        <li>Buyer Rating: <%= buyerRating %></li>\
                                        <li>Seller Rating: <%= sellerRating %></li>\
                                        <li>Release Contributed: <%= releasesContributed %></li>\
                                        </ul>\
                                    </div>\
                                  </div>');


		url2 = '/users/'+searchTerm;

		discogs(headers, url2, function(err, data) {
      var user1 = allUsers.create({
        avatar: data.avatar_url,
        username: data.username,
        rank: data.rank,
        collectionTotal: data.num_collection,
        buyerRating: data.buyer_rating,
        sellerRating: data.seller_rating,
        releasesContributed: data.releases_contributed
      });

      var view = new userView({model: user1});
      $('.container').append(view.render().el);
      console.log(allUsers.length);

      // var releaseTemplate = _.template('<li><%= artist %> - <%= title %></li>');
  		// var paginationTemplate = _.template('<li><a href="#" class="page-number" id="<%= number %>"><%= number %></a></li>');
  		// url = '/users/'+searchTerm+'/collection?per_page=25&page='+pageNumber.toString();

      // $('.container').append(userTemplate({
      //       avatar: data.avatar_url,
      //       username: data.username,
      //       rank: data.rank,
      //       collectionTotal: data.num_collection,
      //       buyerRating: data.buyer_rating,
      //       sellerRating: data.seller_rating,
      //       releasesContributed: data.releases_contributed
      //     }));
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

	changePage: function(e) {
		e.preventDefault();

		if (e.currentTarget.id == 'prev') {
			pageNumber = pageNumber -= 1;
		} else if (e.currentTarget.id == 'next') {
			pageNumber = pageNumber += 1;
		} else if ($(e.currentTarget).hasClass('page-number')) {
			pageNumber = parseInt(e.currentTarget.id);
		}
		this.handleResults(e);
	}
});

module.exports = AppView;
