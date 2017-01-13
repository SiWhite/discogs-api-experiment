var Backbone = require('backbone');
//var Discogs = require('disconnect').Client;
var headers = {
  'accept-encoding': 'gzip,deflate',
  'user-agent': 'YourUserAgent/0.0.1 +http://localhost:3000/' // a unique user agent is required
};
var discogs = require('../discogs');
var url = '';
var pageNumber = 1;
var searchTerm = '';

var AppView = Backbone.View.extend({
  el: 'body',

  events: {
    "submit": "handleSubmit",
    "click a": "changePage",
  },

  initialize: function() {
    //console.log('changePage');
  },

  handleSubmit: function(e) {
    e.preventDefault();
    $('#results').html('');
    searchTerm = $("#user").val();
    var releaseTemplate = _.template('<li><%= artist %> - <%= title %></li>');
    var paginationTemplate = _.template('<li><a href="#" class="page-number" id="<%= number %>"><%= number %></a></li>');
    url = '/users/'+searchTerm+'/collection?per_page=25&page='+pageNumber.toString();

    discogs(headers, url, function(err, data) {
      var pages = data.pagination.pages;
      var releases = data.releases;

      $.each(releases, function(i, release) {
        $('#results').append(releaseTemplate({
          artist: release.basic_information.artists[0].name,
          title: release.basic_information.title,
        }));
     });

     for (i = 1; i < pages; i++) {
       $('#pages').append(paginationTemplate({
          number: i
        }));
     }
    });
  },

  changePage: function(e) {
    e.preventDefault();
    if (e.currentTarget.id == 'prev') {
      pageNumber = pageNumber -= 1;
    } else if (e.currentTarget.id == 'next') {
      pageNumber = pageNumber += 1;
    }

    console.log('pageNumber = ', pageNumber);
  }
});

module.exports = AppView;
