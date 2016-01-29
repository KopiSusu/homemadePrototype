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
    $scope.domElements.timeSelected = "7:30";

    //////////////////////////
    //// Private functions ///
    //////////////////////////

    //Create a request for an eater.
    var _createRequest = function (cooking, eater, servings) {
      chefFactory.createRequest(cooking, eater, servings)
        .then(
          function(request) { 
            //Also send a push here!
            chefFactory.sendPushForRequest(request);
            console.log(request);
            // chefFactory.updateCooking(_cooking,servings); 

          },
          function(errorPayload) {
            console.log(errorPayload);
          }
        );   
    }

    var _getChefDetails = function () {
      chefFactory.getCooking('ceVN2FoR79')
        .then(
          function(cooking) { 
            _cooking = cooking;
            $scope.domElements.meal = cooking.get("meal").get("name");
            $scope.domElements.imgSrc = cooking.get("meal").get("imageURLS")[0];
            $scope.domElements.cook = cooking.get("cook").get("displayName").toUpperCase();
            $scope.domElements.mealDescription = cooking.get("meal").get("information");
            $scope.domElements.ingredients = cooking.get("meal").get('ingredients').replace(/\s[/]/g, ',');
            $scope.domElements.bio = cooking.get("cook").get("bio");
            $scope.domElements.bioImgSrc = cooking.get("cook").get("imageURL");             
          },
          function(errorPayload) {
            $log.error('failure loading movie', errorPayload);
          }
        );   
    }

    _getChefDetails();

    /////////////////////////
    //// Public functions ///
    /////////////////////////

    $scope.selectTimePeriod = function (time) {
      $scope.domElements.timeSelected = time;
    }

    /* testing signup.
      chefFactory.signupUser("101011", "mouse")
        .then(
          function(user) { 
            //Also send a push here!
            console.log(user);
            // chefFactory.updateCooking(_cooking,servings); 
          },
          function(errorPayload) {
            console.log(errorPayload);
          }
      ); 
    */  

    /* testing login.
      chefFactory.loginUser("101011", "mouse")
        .then(
          function(user) { 
            //Also send a push here!
            console.log(user);
            // chefFactory.updateCooking(_cooking,servings); 
          },
          function(errorPayload) {
            console.log(errorPayload);
          }
      ); 
    */  

    /* Accessing the current user in the Parse Object
    var currentUser = chefFactory.currentUser();
    console.log(currentUser);
    */

    /*Testing create customer with a fake token.
    chefFactory.createCustomer("cus_MikeToken", "mike@grazer.co")
        .then(
          function(result) { 
            //Also send a push here!
            console.log(result);
            // chefFactory.updateCooking(_cooking,servings); 
          },
          function(errorPayload) {
            console.log(errorPayload);
          }
      ); 
    */

    /*Example of using updateUser, can pass as many params as you need.
    chefFactory.updateUser({email: "Updated.email@m.com", displayName: "Michael J Dee"})
        .then(
          function(result) { 
            //Also send a push here!
            console.log(result);
            // chefFactory.updateCooking(_cooking,servings); 
          },
          function(errorPayload) {
            console.log(errorPayload);
          }
      );
    */

  }

})();