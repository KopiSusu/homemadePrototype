(function () {

	angular
	    .module('HomeMade')
	    .controller('landingCtrl', landingCtrl)
	  	.directive('landingPartial', landingPartial);

	function landingCtrl ($scope) {
		$scope.testMessage = "Im on the landing page!";
	}

	function landingPartial () {
		return {
		  	restrict: 'E',
		  	templateUrl: 'app/main/landing/landing.html'
		};
	}

})();