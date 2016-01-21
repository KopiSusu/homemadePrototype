angular
    .module('HomeMade.chefFactory', [])
    .factory('chefFactory', chefFactory);

function chefFactory($http, $rootScope, $q, $log) {

  	Parse.initialize("zAOPmmOBH8zN9r5iX6LFHFxLJEnycHIqV7a7QO5F", "z8IhWLkM0NWV82CvWBeKttjVTgKkGib3ICzCyMnN");

  	//Example I was using just to see how Factories work
	var getName = function (identifier) {
	   	return identifier;
	};

	var getCooking = function (identifier) {
		var deferred = $q.defer();
		var cookingsQuery = new Parse.Query('Cooking');
		cookingsQuery.include("cook");
		cookingsQuery.include("meal");
		cookingsQuery.include("meals");

		var innerQuery = new Parse.Query(Parse.User);
		innerQuery.equalTo("objectId", identifier);
		cookingsQuery.matchesQuery("cook",innerQuery);
		cookingsQuery.first().then(function(cooking) {
	      if(cooking)
	      {
	      	deferred.resolve(cooking);
	      } else {
	      	deferred.resolve("Unable to get a cooking");
	      }
	    });
	    return deferred.promise;
	};

	var updateCooking = function (cooking, servings) {
		//Update the requested servings.
		cooking.increment("requestedServings", servings);
		cooking.save();
	};

	var sendPushForRequest = function (request) {

		var time = request.get("time");
        var dateString = (date.getMonth() +1) + "/" + date.getDate();
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

    return {
    	getName: getName,
    	getCooking: getCooking
    }

};