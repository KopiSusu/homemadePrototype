(function () {
	
	angular
	 	.module('HomeMade')
	 	.controller('userCtrl', userCtrl)
		.directive('userPartial', userPartial);

	function userCtrl ($scope) {
		$scope.testMessage = "Im on the user page!";
	}

	function userPartial () {
	 	return {
		   	restrict: 'E',
		   	templateUrl: 'app/main/user/user.html'
	 	};
  	}

})();