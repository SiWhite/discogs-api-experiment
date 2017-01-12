var Backbone = require('backbone');
//var Discogs = require('disconnect').Client;
var headers = {
  'accept-encoding': 'gzip,deflate',
  'user-agent': 'YourUserAgent/0.0.1 +http://localhost:3000/' // a unique user agent is required
};
var discogs = require('../discogs');

var AppView = Backbone.View.extend({
  el: 'body',

  events: {
    "submit": "onSubmit",
  },

  initialize: function() {

  },

  onSubmit: function(e) {
    e.preventDefault();
    $('#results').html('');
    var searchTerm = $("#user").val();
    var template = _.template('<li><%= artist %> - <%= title %></li>');

    discogs(headers, '/users/'+searchTerm+'/collection', function(err, data) {
      var releases =  data.releases;
      //var html = [];

      $.each(releases, function(i, release) {
        $('#results').append(template({
          artist: release.basic_information.artists[0].name,
          title: release.basic_information.title,
        }));
     });

     //console.log(html);
    });
  }
});

module.exports = AppView;
