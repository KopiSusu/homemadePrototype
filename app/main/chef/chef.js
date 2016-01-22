(function () {
  angular
    .module('HomeMade')
    .controller('chefCtrl', chefCtrl);

	function chefCtrl ($scope, $log, chefFactory, apiFactory) {

    // Store Cooking Object, Private
    var _cooking = {};  

    // Attach all elements that need to be passed to the dom to this object, Public
    // ex. scope.domElements.meal = "whatever the meal name is"
    $scope.domElements = {};

    // temp values until api works
    $scope.domElements.availablity = "Mon. 9/18";
    $scope.domElements.mealDescription = "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.";
    $scope.domElements.chefLocation = "Brooklyn, NY";

    //////////////////////////
    //// Private functions ///
    //////////////////////////

    var _getChefDetails = function () {
      chefFactory.getCooking('S7hm3vZhJH')
        .then(
          function(cooking) { 
            _cooking = cooking;
            $scope.domElements.meal = cooking.get("meal").get("name");
            $scope.domElements.cook = cooking.get("cook").get("displayName");
          },
          function(errorPayload) {
            $log.error('failure loading movie', errorPayload);
          }
        );    
    }

    _getChefDetails();

  }

})();