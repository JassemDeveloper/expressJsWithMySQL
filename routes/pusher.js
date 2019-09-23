
var Pusher = require('pusher');
var pusher = new Pusher({
    appId: process.env.APPID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: process.env.CLUSTER,
    encrypted: true,
});

/*
var PusherClient=require('pusher-client');
var pusherClient=new PusherClient('dcc9e263026ffd989e0b', {
    cluster: 'ap2',
    forceTLS: true
  });

  var listen=pusherClient.subscribe('items');
*/

module.exports =pusher;
//module.exports.pusherListener =listen;
