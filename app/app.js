(function () {
	angular
    	.module('HomeMade', [
    		'ngAnimate', 
    		'ui.bootstrap', 
    		'ngRoute', 
    		'HomeMade.chefFactory', 
    		'HomeMade.landingService', 
    		'HomeMade.mealFactory', 
    		'HomeMade.userFactory',
    		'HomeMade.cookingService',
    		'HomeMade.paymentFactory',
    		'HomeMade.paymentService'
    	])
    	.config(['$routeProvider', function($routeProvider) {
    		// This is how to change url and create custom routes. Super easy! add this anywhere in the app
    		// $route.current.templateUrl = '/pages/' + $routeParams.name + ".html";

		    $routeProvider
		    	.when('/chef', {
		        	templateUrl: 'app/main/chef/chef.html',
		        	controller: 'chefCtrl'
		      	})
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
		      	.when('/', {
		      		templateUrl: 'app/main/landing/landing.html',
		        	controller: 'landingCtrl'
		      	})
		      	.otherwise({
		        	redirectTo: '/'
	     		});
	     }]);
})();
