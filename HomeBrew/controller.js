/**
 * http://usejsdoc.org/
 */
var myApp = angular.module('myApp',[]);
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