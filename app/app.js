(function () {
	angular
    	.module('HomeMade', [
    		'ngAnimate', 
    		'ui.bootstrap', 
    		'ngRoute', 
    		'HomeMade.chefFactory', 
    		'HomeMade.mealFactory', 
    		'HomeMade.userFactory',
    		'HomeMade.apiFactory',
    		'HomeMade.cookingService',
    		'HomeMade.paymentFactory',
    		'HomeMade.paymentService'
    	])
    	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    		// This is how to change url and create custom routes. Super easy! add this anywhere in the app
    		// $route.current.templateUrl = '/pages/' + $routeParams.name + ".html";

		    $routeProvider
		    	.when('/chef/:chefId', {
		        	templateUrl: 'app/main/chef/chef.html',
		        	controller: 'chefCtrl'
		      	})
		      	.when('/meal', {
		        	templateUrl: 'app/main/meal/meal.html',
		        	controller: 'mealCtrl'
		      	})
		      	.when('/user/signup', {
		        	templateUrl: 'app/main/user/user.signup.html',
		        	controller: 'userCtrl'
		      	})
		      	.when('/user', {
		        	templateUrl: 'app/main/user/user.html',
		        	controller: 'userCtrl'
		      	})
		      	.otherwise({
		        	redirectTo: '/chef'
	     		});
	     	$locationProvider.html5Mode(true);
	     }]);
})();
