(function () {
  angular
    .module('HomeMade')
    .controller('chefCtrl', chefCtrl);

	function chefCtrl ($scope, $log, $rootScope, $routeParams, chefFactory, apiFactory) {

    var chefId = $routeParams.chefId;
    $rootScope.paymentOpen = false;

    // Store Cooking Object, Private
    var _cooking = {};
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    // Attach all elements that need to be passed to the dom to this object, Public
    // ex. scope.domElements.meal = "whatever the meal name is"
    $scope.domElements = {};

    //////////////////////////
    //// Private functions ///
    //////////////////////////
    // user phonenumber = 2027143646;
    var _loginUser = function (phoneNumber) {
      chefFactory.loginUser(phoneNumber, "mouse")
        .then(
          function(user) { 
            //Also send a push here!
            _getChefDetails(user.id)

            console.log(user);
            // chefFactory.updateCooking(_cooking,servings); 
          },
          function(errorPayload) {
            console.log(errorPayload);
          }
      ); 
    }

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

    var _getChefDetails = function (id) {
      chefFactory.getCooking(id)
        .then(
          function(cooking) { 
            _cooking = cooking;
            $scope.domElements.meal = cooking.get("meal").get("name");
            $scope.domElements.imgSrc = cooking.get("meal").get("imageURLS")[0];
            $scope.domElements.cook = cooking.get("cook").get("displayName").toUpperCase();
            $scope.domElements.mealDescription = cooking.get("meal").get("information");
            $scope.domElements.mealPrice = cooking.get("meal").get("price");
            $scope.domElements.ingredients = cooking.get("meal").get('ingredients').replace(/\s[/]/g, ',');
            $scope.domElements.bio = cooking.get("cook").get("bio");
            $scope.domElements.bioImgSrc = cooking.get("cook").get("imageURL");  
            $scope.domElements.userAddress = {};
            $scope.domElements.userAddress.city = cooking.get("cook").get("city");
            $scope.domElements.userAddress.state = cooking.get("cook").get("state"); 
            $scope.domElements.availablity = (cooking.get("start").getMonth() + 1 ) + "/" + cooking.get("start").getDay();
            $scope.domElements.timePeriods = _getTimePeriods(cooking.get("start"), cooking.get("end"));
            $scope.domElements.day = days[cooking.get("start").getDay()].substring(0, 3) + ".";
          },
          function(errorPayload) {
            $log.error('failure loading movie', errorPayload);
          }
        );   
    }

    var _getTimePeriods = function (start, end) {
      var middle;
      var returnArray = [];
      middle = new Date((start.getTime() + end.getTime()) / 2);
      returnArray = [start, middle, end];
      returnArray = returnArray.map(function(date) {
        var minutes = date.getMinutes();
        var hours = date.getHours();
        if(minutes < 2) {
          minutes = "0" + minutes;
        }
        if(hours > 12) {
          hours = hours - 12;
        }
        return hours + ":" + minutes;
      })
      $scope.domElements.timeSelected = returnArray[1];
      return returnArray;
      }


    /////////////////////////
    //// Public functions ///
    /////////////////////////

    $scope.selectTimePeriod = function (time) {
      $scope.domElements.timeSelected = time;
    }

    $scope.submitOrder = function () {
      var _selectedPeriod = $scope.domElements.timeSelected;
      $rootScope.paymentOpen = true;   
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

    _loginUser(chefId);

  }

})();