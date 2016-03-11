(function () {
  angular
    .module('Homemade')
  	.directive('mainPartial', mainPartial);

  function mainPartial () {
    return {
      restrict: 'E',
      templateUrl: 'app/main/main.html'
    };
  }


})();
