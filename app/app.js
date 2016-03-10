(function () {
	angular
    	.module('HomeMade', [
    		'ngAnimate', 
    		'ui.bootstrap', 
    		'ngRoute',
    		'toaster',
    		'ngTouch',
    		'ngCookies', 
    		'HomeMade.chefFactory', 
    	])
    	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    		// This is how to change url and create custom routes. Super easy! add this anywhere in the app
    		// $route.current.templateUrl = '/pages/' + $routeParams.name + ".html";

		    $routeProvider
		    	.when('/cook/:chefId', {
		        	templateUrl: 'app/main/cook/chef.html',
		        	controller: 'chefCtrl'
		      	})
		      	.otherwise({
		        	redirectTo: '/cook'
	     		});
	     	$locationProvider.html5Mode(true);
	     }]);
})();
