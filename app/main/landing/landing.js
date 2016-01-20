(function () {
  angular
    .module('HomeMade')
  	.directive('landingPartial', landingPartial);

  function landingPartial () {
    return {
      restrict: 'E',
      templateUrl: 'app/landing/landing.html'
    };
  }


})();