angular
    .module('HomeMade.chefFactory', [])
    .factory('chefFactory', chefFactory);

function chefFactory($http, $rootScope) {

	var aCall = function () {
		alert("hello!")
	}

    return {
    	aCall: aCall
    }

};