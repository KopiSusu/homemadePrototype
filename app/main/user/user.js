(function () {
	
	angular
	 	.module('HomeMade')
		.directive('userPartial', userPartial);

	function userPartial () {
	 	return {
	   	restrict: 'E',
	   	templateUrl: 'app/user/user.html'
	 	};
  	}

})();