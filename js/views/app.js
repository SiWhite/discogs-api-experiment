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
var users = {};
var allUsers = new userCollection;

var AppView = Backbone.View.extend({
	el: 'body',

	events: {
		"submit": "getUser",
		"click a": "changePage",
    "click #battle": "handleBattle"
	},

	initialize: function() {

	},

	getUser: function(e) {
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
      users = allUsers.models;

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
		});
	},

  handleBattle: function(e) {
    var $counter= 0;
    var comparisonHolder = {};
    var winnerArray = [];

    $.each(users, function(i, user) {
        $counter += 1;
        comparisonHolder["rank"+$counter] = user.attributes.rank;
        comparisonHolder["collectionTotal"+$counter] = user.attributes.collectionTotal;
        comparisonHolder["buyerRating"+$counter] = user.attributes.buyerRating;
        comparisonHolder["sellerRating"+$counter] = user.attributes.sellerRating;
        comparisonHolder["releasesContributed"+$counter] = user.attributes.releasesContributed;
    });

    if (comparisonHolder.rank1 > comparisonHolder.rank2) {
      winnerArray.push(1)
    } else if (comparisonHolder.rank1 < comparisonHolder.rank2) {
      winnerArray.push(2)
    } 
    if (comparisonHolder.collectionTotal1 > comparisonHolder.collectionTotal2) {
      winnerArray.push(1)
    } else if (comparisonHolder.collectionTotal1 < comparisonHolder.collectionTotal2) {
      winnerArray.push(2)
    }
    if (comparisonHolder.buyerRating1 > comparisonHolder.buyerRating2) {
      winnerArray.push(1)
    } else if (comparisonHolder.buyerRating1 < comparisonHolder.buyerRating2) {
      winnerArray.push(2)
    }
    if (comparisonHolder.sellerRating1 > comparisonHolder.sellerRating2) {
     winnerArray.push(1)
    } else if (comparisonHolder.sellerRating1 < comparisonHolder.sellerRating2) {
      winnerArray.push(2)
    }
    if (comparisonHolder.releasesContributed1 > comparisonHolder.releasesContributed2) {
     winnerArray.push(1)
    } else if (comparisonHolder.releasesContributed1 < comparisonHolder.releasesContributed2) {
      winnerArray.push(2)
    }

    this.getWinner(winnerArray);

},

getWinner: function(winnerArray) {

    var finalTotals = [];
    var $counter = 0;

    for (var i = 0; i < 2; i++) {
      $counter += 1;
      var numOccurences = $.grep(winnerArray, function (elem) {
          return elem === $counter;
      }).length;
      finalTotals.push(numOccurences);
    }

    if (finalTotals[0] > finalTotals[1]) {
      console.log('player1 wins');
    } else if (finalTotals[1] > finalTotals[0]) {
        console.log('player2 wins');
    } else {
      console.log('it\'s a draw!');
    }

  }

});

module.exports = AppView;
