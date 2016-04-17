/**
 * http://usejsdoc.org/
 */
var app = angular.module('GraphApp',[]);
function AppCtrl($scope, $http){
	console.log("Hello World");
	$http.get('/tempList');
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
}


/*
 * Get notifications.
 */
app.controller('tempList', function($scope, $http) {
	$scope.getNotifications = function() {
		$http({
			method : 'GET',
			url : '/CSC440Project1/Notification'
		}).then( function(response) {
			$scope.notif_x = response.data.results;
		});
	}
});