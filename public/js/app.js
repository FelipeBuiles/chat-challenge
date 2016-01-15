angular.module('app', ['app.controllers', 'btford.socket-io', 'ngMaterial', 'luegg.directives'])
.factory('socket', function (socketFactory) {
  return socketFactory();
})
