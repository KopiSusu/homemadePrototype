angular
    .module('HomeMade.apiFactory', [])
    .factory('apiFactory', apiFactory);

function apiFactory($http, $rootScope, parse) {

	var apiObject = {};

	Parse.getUser

	parse.success(function (results) {
		return results;
	});

    return {

    }

};