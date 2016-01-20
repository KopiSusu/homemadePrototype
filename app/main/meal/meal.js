(function () {
	
	angular
		.module('HomeMade')
		.controller('mealCtrl', mealCtrl)
		.directive('mealPartial', mealPartial);

	function mealCtrl ($scope) {
		$scope.testMessage = "Im on the meal page!";
	}

	function mealPartial () {
		return {
	  		restrict: 'E',
	  		templateUrl: 'app/main/meal/meal.html'
		};
	}

})();