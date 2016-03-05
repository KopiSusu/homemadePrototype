(function () {
  angular
    .module('HomeMade')
    .controller('chefCtrl', chefCtrl);

	function chefCtrl ($scope, $log, $rootScope, $routeParams, chefFactory, apiFactory) {

    var chefId = $routeParams.chefId;
    $rootScope.paymentOpen = false;

    // Store Cooking Object, Private
    var _cooking = {};
    var _currentUser = {};
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    // Attach all elements that need to be passed to the dom to this object, Public
    // ex. scope.domElements.meal = "whatever the meal name is"
    $scope.domElements = {};
    $scope.domElements.discounts = 0;
    $scope.domElements.totalFoodCost = 0;
    $scope.domElements.servings = 1;

    //////////////////////////
    //// Private functions ///
    //////////////////////////

    //Create a request for an eater. Also updates the cooking and sends push etc...
    var _createRequest = function (cooking, eater, servings) {
      //We have payment info and order info. 
      //1. Create the request for the order
      //2. Update the cooking with the relevant information
      //3. Show confirmation on screen for the eater
      //4. Send message to cook that the request has come in.

      chefFactory.createRequest(cooking, eater, servings, $scope.domElements.timeSelected)
        .then(
          function(request) { 
            console.log(request);

            console.log(_cooking.get("cook") + " : COOK");

            //Send messages to the cook.
            _sendMessagesForRequest(request);

            //Update the cooking to increment servings.
            chefFactory.updateCooking(_cooking,servings); 

            //Change the UI to show the eater that they have successfully 


          },
          function(errorPayload) {
            console.log(errorPayload);
          }
        );   
    }

    var _getChefCooking = function (id) {
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

    var _calculateTax = function () {
      $scope.domElements.tax = (parseFloat($scope.domElements.totalFoodCost) * 0.09).toFixed(2);
    }

    var _calculateTotal = function () {
      $scope.domElements.total = parseFloat($scope.domElements.tax) + parseFloat($scope.domElements.totalFoodCost) + parseFloat($scope.domElements.discounts); 
    }

    $scope.calculateFoodCost = function () {
      $scope.domElements.totalFoodCost = $scope.domElements.mealPrice * $scope.domElements.servings;
      _calculateTax();
      _calculateTotal();
    }

    var _checkIfCurrentUser = function () {
      _currentUser = chefFactory.currentUser();
      if(_currentUser) {
        $scope.domElements.userInfo = {};
        $scope.domElements.userInfo.stripeId = _currentUser.get("stripeId");
        $scope.domElements.userInfo.email = _currentUser.get("email");
        $scope.domElements.userInfo.phoneNumber = _currentUser.get("username");
        $scope.domElements.userInfo.cardNumber = "**** **** **** " + _currentUser.get("lastFour");
        $scope.domElements.userInfo.cvc = "***";
        $scope.domElements.userInfo.date = "";
      }
    }


    /////////////////////////
    //// Public functions ///
    /////////////////////////

    $scope.selectTimePeriod = function (time) {
      $scope.domElements.timeSelected = time;
    }

    $scope.submitOrder = function () {
      var _selectedPeriod = $scope.domElements.timeSelected;
      $scope.domElements.totalFoodCost = $scope.domElements.mealPrice;
      _calculateTax();
      _calculateTotal();
      $rootScope.paymentOpen = true;   
    }

    // submit credit card information
    // currently creating new payment option, then creating customer, then updating cooking.
    $scope.submitPayment = function () {
      // create stripe thing
      if(_currentUser) {
        if($scope.domElements.userInfo.stripeId)
        {
          console.log("Already have stripe ID " + $scope.domElements.userInfo.stripeId);
          _createRequest(_cooking, _currentUser, $scope.domElements.servings);
        } else {
          //Create customer and 
        chefFactory.addPayementOption($scope.domElements.userInfo.cardNumber, $scope.domElements.userInfo.cvc, _month, _year)
          .then(function (response) {
            chefFactory.createCustomer(response.id, $scope.domElements.userInfo.email)
              .then(
                function(stripeResult) { 
                  //Update user
                  chefFactory.updateUser({stripeId: stripeResult})
                    .then(
                      function(result) { 
                        //createRequest
                        _createRequest(_cooking, _currentUser, $scope.domElements.servings);
                        console.log(result);
                      },
                      function(errorPayload) {
                        console.log(errorPayload);
                      }
                  );
                },
                function(errorPayload) {
                  console.log(errorPayload);
                }
            ); 
          });
        }
      } else {
        var _month;
        var _year;
        _month = $scope.domElements.userInfo.date.split("/")[0];
        if(_month.length < 2) {
          _month = "0" + _month;
        }
        _year = $scope.domElements.userInfo.date.split("/")[1];

        chefFactory.addPayementOption($scope.domElements.userInfo.cardNumber, $scope.domElements.userInfo.cvc, _month, _year)
          .then(function (response) {
            chefFactory.createCustomer(response.id, $scope.domElements.userInfo.email)
              .then(
                function(stripeResult) { 
                  //Create a user here
                  chefFactory.signupUser($scope.domElements.userInfo.phoneNumber, _randomHash())
                    .then(
                      function(user) { 
                        _currentUser = user;
                        _createRequest(_cooking, _currentUser, $scope.domElements.servings);
                        console.log(user + " after logging in");
                        // chefFactory.updateCooking(_cooking,servings); 
                      },
                      function(errorPayload) {
                        console.log(errorPayload);
                      }
                  ); 
                },
                function(errorPayload) {
                  console.log(errorPayload);
                }
            ); 
          })
      }
    }

    var _submitPaymentUpdateCooking = function (customerId) {


      chefFactory.updateCooking(_cooking, $scope.domElements.servings) 
    }


    var _sendMessagesForRequest = function (request) {
      //Send push and text
      chefFactory.sendPushForRequest(request);
      chefFactory.sendTextForRequest(request, _cooking.get("cook"));

    }

    var _randomHash = function () {
      //Actually generate a random hash here to use as password.
      return "mouse";
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

     // Accessing the current user in the Parse Object

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

    _checkIfCurrentUser();
    _getChefCooking(chefId);

  }

})();