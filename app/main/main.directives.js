(function () {
  angular
    .module('HomeMade')
  	.directive('mainPartial', mainPartial);

  function mainPartial () {
    return {
      restrict: 'E',
      templateUrl: 'app/main/main.html'
    };
  }


})();
