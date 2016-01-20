(function () {
	
	angular
		.module('HomeMade')
		.directive('mealPartial', mealPartial);

	function mealPartial () {
		return {
	  		restrict: 'E',
	  		templateUrl: 'app/meal/meal.html'
		};
	}

})();