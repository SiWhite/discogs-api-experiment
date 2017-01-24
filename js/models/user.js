var Backbone = require('backbone');

var User = Backbone.Model.extend({
	  defaults: {
      avatar: '',
      username: '',
      rank: 0,
      collectionTotal: 0,
      buyerRating: 0,
      sellerRating: 0,
      releasesContributed: 0
		}
});

module.exports = User;
