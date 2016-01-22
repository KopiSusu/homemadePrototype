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

    // temp values still needed from API
    $scope.domElements.availablity = "Mon. 9/18";
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
            $scope.domElements.imgSrc = cooking.get("meal").get("imageURLS")[0];
            $scope.domElements.cook = cooking.get("cook").get("displayName");
            $scope.domElements.mealDescription = cooking.get("meal").get("information");
          },
          function(errorPayload) {
            $log.error('failure loading movie', errorPayload);
          }
        );    
    }

    _getChefDetails();

  }

})();