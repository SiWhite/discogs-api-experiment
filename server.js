var express = require('express');
var app = express();
// var Discogs = require('disconnect').Client;
// var oAuth = new Discogs().oauth();

app.use(express.static('public'));

app.get('*', function(req, res){
  res.sendFile(__dirname);

  // oAuth.getRequestToken(
  //     'rxPLqJaMTZNbjQCYaXSa',
  //     'sevVVafyZRVZdkZPxxkzTZBKWhcfQUIF',
  //     'http://localhost:3000/',
  //     function(err, requestData){
  //         // Persist "requestData" here so that the callback handler can
  //         // access it later after returning from the authorize url
  //         res.redirect(requestData.authorizeUrl);
  //         console.log('got here')
  //     }
  // );
});

// app.get('/authorize', function(req, res){
//     var oAuth = new Discogs().oauth();
//     oAuth.getRequestToken(
//       'rxPLqJaMTZNbjQCYaXSa',
//       'sevVVafyZRVZdkZPxxkzTZBKWhcfQUIF',
//       'http://localhost:3000/',
//       function(err, requestData){
//             // Persist "requestData" here so that the callback handler can
//             // access it later after returning from the authorize url
//             res.redirect(requestData.authorizeUrl);
//       }
//     );
// });
//
// app.get('/callback', function(req, res){
//     var oAuth = new Discogs(requestData).oauth();
//     oAuth.getAccessToken(
//         req.query.oauth_verifier, // Verification code sent back by Discogs
//         function(err, accessData){
//             // Persist "accessData" here for following OAuth calls
//             res.send('Received access token!');
//         }
//     );
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
