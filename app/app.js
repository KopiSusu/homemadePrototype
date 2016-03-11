(function () {
	angular
    	.module('Homemade', [
    		'ngAnimate', 
    		'ui.bootstrap', 
    		'ngRoute',
    		'toaster',
    		'ngTouch',
    		'ngCookies', 
    		'Homemade.chefFactory', 
    	])
    	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    		// This is how to change url and create custom routes. Super easy! add this anywhere in the app
    		// $route.current.templateUrl = '/pages/' + $routeParams.name + ".html";

		    $routeProvider
		    	.when('/cooks/:chefId', {
		        	templateUrl: 'app/main/chef/chef.html',
		        	controller: 'chefCtrl'
		      	})
                .when('/:chefId', {
                    templateUrl: 'app/main/chef/chef.html',
                    controller: 'chefCtrl'
                })
		      	.otherwise({
		        	redirectTo: '/cooks'
	     		});
	     	$locationProvider.html5Mode(true);
	     }]);
})();
