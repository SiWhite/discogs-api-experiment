var Backbone = require('backbone');
var user = require('../models/user');
var userCollection = require('../collections/users');
var userView = require('../views/user-view');
var pageNumber = 1;
var searchTerm = '';
var users = {};
var allUsers = new userCollection;

/* collection pagination */
var releaseTemplate = _.template('<li><%= artist %> - <%= title %></li>');
var paginationTemplate = _.template('<li><a href="#" class="page-number" id="<%= number %>"><%= number %></a></li>');

var AppView = Backbone.View.extend({
	el: 'body',

	events: {
    "click #start": "showtBattle",
		"submit": "getUser",
    "click #battle": "handleBattle",
    "click #restart": "reloadPage",
    "click #winnerCollection": 'gotoCollection'
	},

	initialize: function() {
    $("#svg").css({
      "-webkit-animation":"spin 2s infinite linear",
      "-moz-animation":"spin 2s infinite linear",
      "-o-animation":"spin 2s infinite linear",
      "-ms-animation":"spin 2s infinite linear"
    });
	},

  showtBattle: function(e) {
    e.preventDefault();
    $('.main-content').removeClass('hidden');
    $('.intro').addClass('hidden');
  },

	getUser: function(e) {
		e.preventDefault();
    var that = this;

    if (!$('#user').val()) {
      $('#error').text('Please enter a username.').removeClass('hidden');
          return;
    }

		var searchTerm = $("#user").val();
		var url = '//api.discogs.com/users/'+searchTerm;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        success: function (data) {
            that.handleUser(data);
        },
    });
  },


		handleUser: function(data) {

      var userdata = data.data;
      console.log(userdata);

			if ( data.hasOwnProperty("message") ) {
				$('#error').text('No Discogs user by that name, please try again.').removeClass('hidden');
    			return;
			}

		  var user = allUsers.create({
				avatar: userdata.avatar_url,
				username: userdata.username,
				rank: userdata.rank,
				collectionTotal: userdata.num_collection,
				buyerRating: userdata.buyer_rating,
				sellerRating: userdata.seller_rating,
				releasesContributed: userdata.releases_contributed
		  });

			var view = new userView({model: user});
      users = allUsers.models;

      if (users.length === 1 ) {
        $('#player1 img').attr('src', userdata.avatar_url);
        $('#player1').append(view.render().el);
        $('label[for="user"] span').text('2');
        $('#user').val('');
      } else if ( users.length === 2 ) {
        $('#player2 img').attr('src', userdata.avatar_url);
        $('#player2').append(view.render().el);
        $('form').addClass('hidden');
        $('#battle').removeClass('hidden');
      } else {
        return;
      }

      $('.error').addClass('hidden');
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
    var winnerNum = '1';
    var winnerName = '';

    for (var i = 0; i < 2; i++) {
      $counter += 1;
      var numOccurences = $.grep(winnerArray, function (elem) {
        return elem === $counter;
      }).length;
      finalTotals.push(numOccurences);
    }

    if (finalTotals[0] > finalTotals[1]) {
      $('#player2').addClass('hidden');
      $('#player1').parent().removeClass('col-sm-3 col-sm-offset-3').addClass('col-sm-4 col-sm-offset-4 winner');
    } else if (finalTotals[1] > finalTotals[0]) {
      winnerNum = '2';
      winnerName = '';
      $('#player1').parent().addClass('hidden');
      $('#player2').parent().removeClass('col-sm-3').addClass('col-sm-4 col-sm-offset-4 winner');
    } else {
      $('#winnerRow span').text(winnerNum);
      $('#winnerRow h2').text('It\'s a draw!');
    }

    $('#battle').addClass('hidden');
    $('#player'+winnerNum+' ul li').removeClass('hidden');
    $('.site-content p').addClass('hidden');
    $('#player'+winnerNum+' h2').append(' wins!');
    winnerName = $('.winner').find('.username span').text();
    $('#winnerCollection').data('username', winnerName);
    $('#winnerRow').removeClass('hidden');
  },

  reloadPage: function(e) {
    location.reload();
  },

  gotoCollection: function(e) {
    searchTerm = $(e.currentTarget).data('username');
    var collectionUrl = 'https://discogs.com/user/'+searchTerm+'/collection';
    window.open(collectionUrl, '_blank');
  }

});

module.exports = AppView;
