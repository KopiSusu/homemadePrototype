(function () {
  angular
    .module('HomeMade')
    .controller('chefCtrl', chefCtrl)
    .directive('chefPartial', chefPartial);

    function chefCtrl ($scope, chefFactory, $log) {
      $log.log('in the factory.');

      // getCustomers();
      $scope.testMessage = "Im on the chef page!";
      $scope.fakeName = chefFactory.getName("mikeDee");   

      var promise = 
           chefFactory.getCooking('S7hm3vZhJH');
       promise.then(
          function(cooking) { 
              $scope.cooking = cooking;
              $scope.meal = cooking.get("meal");
              $scope.cook = cooking.get("cook");
          },
          function(errorPayload) {
              $log.error('failure loading movie', errorPayload);
          });     

      $log.log('After Promise.');
 
      }

  function chefPartial () {
    return {
      restrict: 'E',
      templateUrl: 'app/main/chef/chef.html'
    };
  }

})();