if (Meteor.isClient) {
  angular.module('repeat',[
      'angular-meteor',
      'ionic'
    ]);

  function onReady() {
    angular.bootstrap(document, ['repeat']);
  }

  if (Meteor.isCordova) {
    angular.element(document).on("deviceready", onReady);
  }
  else {
    angular.element(document).ready(onReady);
  }

  angular.module('repeat').config(['$locationProvider', '$interpolateProvider',
    function($locationProvider, $interpolateProvider) {
      // This adds way to use Angular expressions in Meteor templates
      // with [[]] wrapper since it's allowed to
      // mix Angular and Meteor expressions in the project.
      $interpolateProvider.startSymbol('[[');
      $interpolateProvider.endSymbol(']]');
    }
  ]);

  angular.module('repeat').controller('MainCtrl', ['$scope', '$meteor',
    function($scope, $meteor) {
    var pureitems = [];
    for (var i = 0; i < 1000; i++) pureitems.push(i);
    console.log(pureitems);
    $scope.items = pureitems;
  }]);
}

Router.route('/', {
  name: 'feed',
  controller: 'FeedController',
  action: 'action',
  where: 'client'
});


FeedController = RouteController.extend({
  action: function () {
    this.render('Feed');
  },
  onAfterAction: function () {
    Tracker.afterFlush(function () {
      angular.element(document).injector().invoke([
        '$compile', '$document', '$rootScope',
        function ($compile, $document, $rootScope) {
          $compile($document)($rootScope);
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        }
      ]);
    });
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
