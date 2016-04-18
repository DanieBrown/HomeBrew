/**
 * http://usejsdoc.org/
 */
var app = angular.module('GraphApp',[]);
app.controller('TempList', function($scope, $http){
	temp1 = {
			temp: 77,
			time: 5
	};
	temp2 = {
			temp: 99,
			time: 69
	};
	temp3 = {
			temp: 69,
			time: 5
	};
	var tempList = [temp1,temp2,temp3];
	$scope.tempList = tempList;
});


/*
 * Get notifications.
 */
app.controller('tempList', function($scope, $http) {
	$scope.ListTemperatures = function() {
		$http({
			method : 'GET',
			url : '/Database.js'
		}).then( function(response) {
			$scope.TEMP = response.data.results;
		});
	}
});