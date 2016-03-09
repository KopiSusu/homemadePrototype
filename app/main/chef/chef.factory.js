angular
    .module('HomeMade.chefFactory', [])
    .factory('chefFactory', chefFactory);

function chefFactory($http, $rootScope, $q, $log) {

  	Parse.initialize("2JaqaPhXQ87McQQKGGEsCpv8zODw2C2j82mZSDeW", "TOjSospd3VmFRGFvKg9W0H5JvbElQoeh3QWzfbxm");
  	Stripe.setPublishableKey('pk_test_Nx9eaN9m2BHbM8oz8J6fi8HZ');

  	///////////////////////////////////////
  	//// Public Functions To Be Shared ////
  	///////////////////////////////////////

	var getCooking = function (identifier) {
		var deferred = $q.defer();
		var cookingsQuery = new Parse.Query('Cooking');
		cookingsQuery.include("cook");
		cookingsQuery.include("meal");
		cookingsQuery.include("meals");

		var innerQuery = new Parse.Query(Parse.User);
		innerQuery.equalTo("uniqueName", identifier);
		cookingsQuery.matchesQuery("cook", innerQuery);
		cookingsQuery.first().then(function(cooking) {
	      if(cooking)
	      {
	      	deferred.resolve(cooking);
	      } else {
	      	deferred.reject("Unable to get a cooking");
	      }
	    });
	    return deferred.promise;
	};

	var updateCooking = function (cooking, servings) {
		//Update the requested servings.		
		servings = parseInt(servings);
		cooking.increment("requestedServings", servings);
		cooking.save();
	};

	//Not fully implemented yet Need to attach eater to request.
	var createRequest = function (cooking, eater, servings, time) {
		var deferred = $q.defer();
		var meal = cooking.get("meal");
		var Request = Parse.Object.extend("Request");
		var request = new Request();
		request.set("servings", servings);
		request.set("status", "new");
		request.set("pickup", "pickup");
		request.set("cooking", cooking);
		request.set("meal", meal);
		request.set("cook", cooking.get("cook"));
		request.set("eater", eater);
		// console.log("time selected : " + time.dateValue);
		request.set("time", time.dateValue);
		request.set("time", cooking.get("start"));	
		request.set("start", cooking.get("start"));
		request.set("end", cooking.get("end"));
		var mealDict = {imageURLS: meal.get("imageURLS"), objectId: meal.id, name: meal.get("name")};
		var cartItems = [{addOns: [], meal: mealDict, price: meal.get("price"), servings: servings}];
		request.set("cartItems", cartItems);

		request.save().then(function(request) {
	      if(request)
	      {
	      	deferred.resolve(request);
	      } else {
	      	deferred.reject("Unable to save request");
	      }
	    });
	  	return deferred.promise;
	};

	var sendPushForRequest = function (request) {
		var time = request.get("time");
        var dateString = (time.getMonth() +1) + "/" + time.getDate();
		var message = "An eater requested " + request.get("servings") + " servings on " + dateString + ".";
		var pushQuery = new Parse.Query(Parse.Installation);
        pushQuery.equalTo("userId",request.get("cook").id);

		Parse.Push.send({
			where: pushQuery,
		    data: {
		  	  	alert: message,
		    	type: "request",
		  		objectId: request.get("cook").id,
		  		badge: "Increment"
		  	}
		});
	}

	var sendTextForRequest = function (request, cook) {
		var time = request.get("time");
        var dateString = (time.getMonth() +1) + "/" + time.getDate();
		var message = "An eater requested " + request.get("servings") + " servings on " + dateString + ".";
		
		var params = {
						phoneNumber: cook.get("username"),
					  	message: message 
					};

		Parse.Cloud.run('sendTwilioText', params, {
		  success: function(response) {
		  	console.log("Success : " + response);
		    // ratings should be 4.5
		  },
		  error: function(error) {
		  	console.log("error in cloud call : " + error);

		  }
		});
	}

	//MARK Login & Signup Methods
	var signupUser = function (phoneNumber, password) {
		var deferred = $q.defer();
		var user = new Parse.User();
		phoneNumber = phoneNumber.replace(/\D/g, '');
		user.set("username", phoneNumber);
		user.set("password", password);
		// user.set("email", "email@example.com");
		user.signUp(null, {
		  success: function(user) {
		    // Hooray! Let them use the app now.
		   	deferred.resolve(user);
		  },
		  error: function(user, error) {
		    // Show the error message somewhere and let the user try again.
	      	deferred.reject(user);
		  }
		});
		return deferred.promise;
	}

	var loginUser = function (phoneNumber, password) {
		var deferred = $q.defer();
		phoneNumber = phoneNumber.replace(/\D/g, '');
		Parse.User.logIn(phoneNumber, password, {
		  success: function(user) {
		    // Do stuff after successful login.
		   	deferred.resolve(user);
		  },
		  error: function(user, error) {
		    // The login failed. Check error to see why.
	      	deferred.reject(error);
		  }
		});
		return deferred.promise;
	}

	var updateUser = function (params) {
		var deferred = $q.defer();
		var user = Parse.User.current();
		for (var key in params) {
			user.set(key, params[key]);
		}
		user.save().then(function(user) 
		{
			deferred.resolve(user);
		} , function(error) {
		// the save failed.
		  console.log("failed to save user with error " + error.message);
		  deferred.reject(error);
		});
      return deferred.promise;
	}

	var currentUser = function () {
		return Parse.User.current();
	}

	//Stripe calls.

	var createCustomer = function (token, email) {
		var deferred = $q.defer();
		var cloudParams = {card: token, email: email}
		Parse.Cloud.run("createCustomer", cloudParams).then(function(result) {
		    // make sure the set the enail sent flag on the object
		    //Result should be the cus_IDENTIFIER from stripe. We can update user with it.
		    console.log("result :" + JSON.stringify(result))
		    deferred.resolve(result);
		}, function(error) {
		    // error
		    console.log(error);
		    deferred.reject(error);
		});
		return deferred.promise;
	}

	/// if current user changes payment for card
	var updateCustomer = function (customerID, token) {
		var deferred = $q.defer();
		var cloudParams = {stripeId: token}
		Parse.Cloud.run("createCustomer", cloudParams).then(function(result) {
		    // make sure the set the enail sent flag on the object
		    //Result should be the cus_IDENTIFIER from stripe. We can update user with it.
		    console.log("result :" + JSON.stringify(result))
		}, function(error) {
		    // error
		    console.log(error);
		    deferred.reject(error);
		});
		return deferred.promise;
	}
 	
 	var addPayementOption = function (number, cvc, exp_month, exp_year) {
 		var deferred = $q.defer();
 		Stripe.card.createToken({
			number: number,
			cvc: cvc,
			exp_month: exp_month,
			exp_year: exp_year
		}, function (status, response) {
			deferred.resolve(response);
		});
		return deferred.promise;
 	}


	/////////////////////////////////////
  	//// Private functions not shared ///
  	/////////////////////////////////////

    return {
    	getCooking: getCooking,
    	updateCooking: updateCooking,
    	createRequest: createRequest,
    	signupUser: signupUser,
    	loginUser: loginUser,
    	currentUser: currentUser,
    	addPayementOption: addPayementOption,
    	createCustomer: createCustomer,
    	updateCustomer: updateCustomer,
    	updateUser: updateUser,
    	sendPushForRequest: sendPushForRequest,
    	sendTextForRequest: sendTextForRequest
    }

};