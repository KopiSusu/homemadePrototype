(function () {
  angular
    .module('HomeMade')
  	.controller('sidenavCtrl', sidenavCtrl)
  	.directive('sidenavPartial', sidenavPartial);

  function sidenavPartial () {
    return {
      restrict: 'E',
      templateUrl: 'app/sidenav/sidenav.html',
      controller: 'sidenavCtrl'
    };
  }

  function sidenavCtrl ($scope, $rootScope) {
  	
  }
})();
