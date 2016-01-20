(function () {
  angular
    .module('HomeMade')
  	.directive('chefPartial', chefPartial);

  function chefPartial () {
    return {
      restrict: 'E',
      templateUrl: 'app/chef/chef.html'
    };
  }


})();