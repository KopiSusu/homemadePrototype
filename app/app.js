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
		    	.when('/cooks/:chefId', {
		        	templateUrl: 'app/main/cooks/chef.html',
		        	controller: 'chefCtrl'
		      	})
		      	.otherwise({
		        	redirectTo: '/cooks'
	     		});
	     	$locationProvider.html5Mode(true);
	     }]);
})();
