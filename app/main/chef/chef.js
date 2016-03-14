(function () {
  angular
    .module('Homemade')
    .controller('chefCtrl', chefCtrl)

	function chefCtrl ($scope, $log, $rootScope, $routeParams, $cookies, $location, toaster, chefFactory) {
    // for cookies, check out https://docs.angularjs.org/api/ngCookies/service/$cookies
    // example
    //
    // Retrieving a cookie (key)
    // var favoriteCookie = $cookies.get('myFavorite');
    //
    // Setting a cookie (key, value)
    // $cookies.put('myFavorite', 'oatmeal');

    var chefId = $routeParams.chefId;
    $rootScope.paymentOpen = false;

    // Store Cooking Object, Private
    var _cooking = {};
    var _userParms = {};
    var _lastFour;
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    // Attach all elements that need to be passed to the dom to this object, Public
    // ex. scope.domElements.meal = "whatever the meal name is"
    $scope.domElements = {};
    $scope.domElements.discounts = 0;
    $scope.domElements.totalFoodCost = 0;
    $scope.domElements.servings = 1;
    $scope.domElements.loginInfo = {};
    $scope.domElements.loginInfo.password = "";
    $scope.domElements.loginInfo.username = "";
    $scope.domElements.pageLoading = false;
    $scope.selectedButton = false;
    $scope.isEmpty = false;

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

      chefFactory.createRequest(cooking, eater, servings, $scope.domElements.timeSelected.dateValue)
        .then(
          function(request) { 
            console.log(request);

            console.log(_cooking.get("cook") + " : COOK");

            //Send messages to the cook.
            _sendMessagesForRequest(request);

            //Update the cooking to increment servings.
            chefFactory.updateCooking(_cooking,servings); 

            $scope.domElements.pageLoading = false;
            $scope.selectedButton = false;
            //Change the UI to show the eater that they have successfully 
            toaster.pop('success', "Your order has been sent to the cook", $scope.domElements.servings + " Servings of " + $scope.domElements.meal);
            //Let's set the servings back to 1 and calculate the cost.
            $scope.domElements.servings = 1;
            _calculateFoodCost();

          },
          function(errorPayload) {
            toaster.pop('error', "Something went wrong!", errorPayload);
          }
        );   
    }

    // grabs the meal and chef data and attaches it to the dom.
    // This function is run on page load.
    var _getChefCooking = function (id) {
      $scope.domElements.pageLoading = true;
      chefFactory.getCooking(id)
        .then(
          function(cooking) { 
            $scope.domElements.pageLoading = false;
            $scope.isEmpty = false;
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
            $scope.domElements.availablity = (cooking.get("start").getMonth() + 1 ) + "/" + cooking.get("start").getDate();
            $scope.domElements.timePeriods = _getTimePeriods(cooking.get("start"), cooking.get("end"));
            $scope.domElements.day = days[cooking.get("start").getDay()].substring(0, 3) + ".";
            console.log(cooking.get("start") + " is the cooking start.");
          },
          function(errorPayload) {
            $scope.isEmpty = true;
            $scope.domElements.pageLoading = false;
            $log.error('failure loading movie', errorPayload);

          }
        );   
    }

    // Creates an array of three objects to be used as the start, middle, and end time periods (for purchase).
    // Each period has displayName and dateValue.
    var _getTimePeriods = function (start, end) {
      var middle;
      var returnArray = [];
      middle = new Date((start.getTime() + end.getTime()) / 2);
      returnArray = [start, middle, end];
      returnArray = returnArray.map(function(date) {
        var returnObject = {};
        var minutes = date.getMinutes();
        var hours = date.getHours();

        if(minutes < 2) {
          minutes = "0" + minutes;
        }
        if(hours === 0) {
          hours = 12;
        } else if(hours > 12) {
          hours = hours - 12;
        }
        returnObject.displayName = hours + ":" + minutes;
        returnObject.dateValue = date;
        return returnObject;
      })
      $scope.domElements.timeSelected = returnArray[1];
      return returnArray;
    }

    // These three functions are used to caluculate tax and total pricing. Pretty strait forward just some simple mathamatics.
    var _calculateTax = function () {
      $scope.domElements.tax = (parseFloat($scope.domElements.totalFoodCost) * 0.09).toFixed(2);
    }
    var _calculateTotal = function () {
      $scope.domElements.total = parseFloat($scope.domElements.tax) + parseFloat($scope.domElements.totalFoodCost) + parseFloat($scope.domElements.discounts); 
    }
    var _calculateFoodCost = function () {
      $scope.domElements.totalFoodCost = $scope.domElements.mealPrice * $scope.domElements.servings;
      _calculateTax();
      _calculateTotal();
    }

    // checks for current user, if none found in the controller it tries to get it from the factory. This does not make a request for the user.
    var _checkIfCurrentUser = function () {
      $scope.currentUser = chefFactory.currentUser();

      if($scope.currentUser) {
        console.log("Had a current user");
        $scope.domElements.userInfo = {};
        $scope.domElements.userInfo.stripeId = $scope.currentUser.get("stripeId");
        $scope.domElements.userInfo.email = $scope.currentUser.get("email");
        $scope.domElements.userInfo.phoneNumber = $scope.currentUser.get("username");
        $scope.domElements.userInfo.cardNumber = $scope.currentUser.get("lastFour") ? "**** **** **** " + $scope.currentUser.get("lastFour") : "";
        $scope.domElements.userInfo.password = $scope.currentUser.get("password");
        $scope.domElements.userInfo.date = $scope.currentUser.get("date");
        if ($scope.currentUser.get("stripeId")) {
          $scope.domElements.userInfo.cardNumber = "**** **** **** " + $scope.currentUser.get("lastFour");
          $scope.domElements.userInfo.cvc = "***";
          $scope.domElements.userInfo.cardMonth = "**";
          $scope.domElements.userInfo.cardYear = "**";
        };
      } else {
        console.log("Didn't have a current user");
      }
    }

    var checkIfDefined = function (failedLogin) {
      //We only actually need
      if (failedLogin) {
        var failedLoginString = "Unable to login to user.";
      };
      if(!$scope.domElements.userInfo || !$scope.domElements.userInfo.phoneNumber) {
        toaster.pop('warning', "Phone number required", failedLoginString);
        return false;
      } else if (!$scope.domElements.userInfo || !$scope.domElements.userInfo.email) {
        toaster.pop('warning', "email required", failedLoginString);
        return false;
      } else if (!$scope.domElements.userInfo || !$scope.domElements.userInfo.cardNumber) {
        toaster.pop('warning', "Card number required", failedLoginString);
        return false;
      } else if (!$scope.domElements.userInfo || !$scope.domElements.userInfo.cvc) {
        toaster.pop('warning', "cvc required", failedLoginString);
        return false;
      } else if (!$scope.domElements.userInfo || !$scope.domElements.userInfo.cardMonth || !$scope.domElements.userInfo.cardYear) {
        toaster.pop('warning', "exp. date required", failedLoginString);
        return false;
      } else if (!$scope.domElements.userInfo || !$scope.domElements.userInfo.password && $scope.domElements.userInfo.stripeId) {
        toaster.pop('warning', "Password required");
        return false;
      } 
      return true;
    }

    ////////////////////////////////////////////
    //// Stuff to keep a keen eye on, arrrrr ///
    ////////////////////////////////////////////

    $scope.$watch(
      "domElements.servings",
      function handleFooChange( newValue, oldValue ) {
        _calculateFoodCost();
      }
    );

    /////////////////////////
    //// Public functions ///
    /////////////////////////
    // These are the functions that can be attached to dom elements. //

    // Selects desired time period and attaches it to object.
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

    $scope.login = function () {
      if($scope.domElements.loginInfo.username.length === 0) {
        toaster.pop('warning', "Username required");
      } else if ($scope.domElements.loginInfo.password.length === 0) {
        toaster.pop('warning', "Password required");
      } else {
        chefFactory.loginUser($scope.domElements.loginInfo.username, $scope.domElements.loginInfo.password)
          .then(
            function(user) { 
              //Also send a push here!
              $scope.currentUser = user;
              _checkIfCurrentUser();
              // chefFactory.updateCooking(_cooking,servings); 
            },
            function(errorPayload) {
              toaster.pop('error', "Something went wrong!", errorPayload);
            }
          ); 
      }

    }

    $scope.backToCooking = function () {
      $rootScope.paymentOpen = false;
    }

    $scope.logoutUser = function () {
      chefFactory.logoutUser();

      $scope.selectedButton = false;
      $scope.domElements.userInfo = {};

      delete $scope.currentUser;
    }

    $scope.selectLoginSignup = function () {
      $scope.selectedButton = !$scope.selectedButton;
    }
    
    // submit credit card information
    // currently creating new payment option, then creating customer, then updating cooking.
    $scope.submitPayment = function () {
        if($scope.currentUser) {
          $scope.domElements.pageLoading = true;
          if($scope.domElements.userInfo.stripeId)
          {
            _createRequest(_cooking, $scope.currentUser, parseInt($scope.domElements.servings));
          } else {
            //We need to add info.
            if(checkIfDefined()) {
              _lastFour = ("" + $scope.domElements.userInfo.cardNumber).replace(/[^0-9]/, '');
              _lastFour = _lastFour.substring(_lastFour.length - 4);
              _userParms = {
                'lastFour': _lastFour,
                'email': $scope.domElements.userInfo.email,
                'date': $scope.domElements.userInfo.cardMonth + "/" + $scope.domElements.userInfo.cardYear,
                'password': $scope.domElements.userInfo.password
              }
            }
            var _month;
            var _year;
            _month = $scope.domElements.userInfo.cardMonth
            if(_month.length < 2) {
              _month = "0" + _month;
            }
            _year = $scope.domElements.userInfo.cardYear;
            
            chefFactory.addPayementOption($scope.domElements.userInfo.cardNumber, $scope.domElements.userInfo.cvc, _month, _year)
              .then(function (response) {
                chefFactory.createCustomer(response.id, $scope.domElements.userInfo.email)
                  .then(
                    function(stripeResult) { 
                      //Update user
                      _userParms.stripeId = stripeResult;
                      chefFactory.updateUser(_userParms)
                      .then(
                        function(result) { 
                          //createRequest
                          _createRequest(_cooking, $scope.currentUser, $scope.domElements.servings);
                        },
                        function(errorPayload) {
                          console.log(errorPayload);
                          toaster.pop('error', "Something went wrong!", "You have already made a request for this meal!");
                          $scope.domElements.pageLoading = false;
                        }
                      );
                    },
                    function(errorPayload) {
                      console.log(errorPayload);
                      toaster.pop('error', "Something went wrong!", errorPayload);
                      $scope.domElements.pageLoading = false;
                    }
                  ); 
              });
          }
        } else {
          //Find or signup user if we have phone number, password, email.
          if (!$scope.domElements.userInfo || !$scope.domElements.userInfo.phoneNumber || !$scope.domElements.userInfo.password) {
            toaster.pop('error', "Something went wrong!", "Make sure to enter phone number and password.");
            return;
          };
          $scope.domElements.pageLoading = true;
          chefFactory.findOrSignupUser($scope.domElements.userInfo.phoneNumber, $scope.domElements.userInfo.password, $scope.domElements.userInfo.email)
            .then(
              function(user) { 
                //We have a user change state.

                if (user.get("stripeId")) {
                  $scope.currentUser = user;
                  _checkIfCurrentUser();
                  _createRequest(_cooking, $scope.currentUser, parseInt($scope.domElements.servings));
                } else {
                  //We got a user, but let's see what we should do.
                  if(checkIfDefined(true)) {
                    _lastFour = ("" + $scope.domElements.userInfo.cardNumber).replace(/[^0-9]/, '');
                    _lastFour = _lastFour.substring(_lastFour.length - 4);
                    __userParms = {
                      'lastFour': _lastFour,
                      'email': $scope.domElements.userInfo.email,
                      'date': $scope.domElements.userInfo.cardMonth + "/" + $scope.domElements.userInfo.cardYear,
                      'password': $scope.domElements.userInfo.password
                    } 
                    $scope.currentUser = user;
                    _createStripeCustomerThenSignup();
                    // _checkIfCurrentUser();
                  } else {
                    $scope.logoutUser();
                    $scope.domElements.pageLoading = false;
                  }
                }
              },
              function(errorPayload) {
                console.log(errorPayload);
                toaster.pop('error', "Something went wrong!", "Unable to sign in to your account");
                $scope.domElements.pageLoading = false;
              }

          );
        }
      }
    

    
    var _createStripeCustomerThenSignup = function () {    

      $scope.domElements.pageLoading = true;
      var _month;
      var _year;
      _month = $scope.domElements.userInfo.cardMonth ;
      if(_month.length < 2) {
        _month = "0" + _month;
      }
      _year = $scope.domElements.userInfo.cardYear;

      
      chefFactory.addPayementOption($scope.domElements.userInfo.cardNumber, $scope.domElements.userInfo.cvc, _month, _year)
        .then(function (response) {
        
          chefFactory.createCustomer(response.id, $scope.domElements.userInfo.email)
            .then(
              function(stripeResult) { 
                //Create a user here
              _userParms.stripeId = stripeResult;
              
              chefFactory.updateUser(_userParms)
                .then(
                  function(result) { 
                    //createRequest
                    _createRequest(_cooking, $scope.currentUser, $scope.domElements.servings);
                  },
                  function(errorPayload) {
                    console.log(errorPayload);
                    toaster.pop('error', "Something went wrong!", "We were unable to create a request for you.");
                    $scope.domElements.pageLoading = false;
                  }
                );
              
        });
        
      });
    }
    


    var _sendMessagesForRequest = function (request) {
      //Send push and text
      chefFactory.sendPushForRequest(request);
    }


    _checkIfCurrentUser();
    _getChefCooking(chefId);

  }

})();