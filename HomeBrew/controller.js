/* Controller */
var chart_view = angular.module('chart_view_module', ["highcharts-ng"]);

//chart_view.controller('chart_header_ctrl'),
//   function ($scope, $http) {
//      $http({
//         method: 'GET',
//         url: '/getName'
//      }).then(function (response) {
//         $scope.db_name = response.data;
//      });
//   }
//var dataset = [];
//chart_view.controller('ctrl02', function($scope, $http) {
//    $http({
//        method : 'GET',
//        url : '/getTemp'
//    }).then( function(response) {        
//        dataset = response.data;
//       alert("response" + response.data);
//    });
//});

chart_view.controller('monitor_ctrl', function ($scope, $timeout, $http) {
//   $scope.dataset;
   
   $http({
        method : 'GET',
        url : '/getTemp'
    }).then( function(response) {        
        $scope.dataset = response.data;
    });
   
   
   $scope.populate = function () {
//      var arr = json.parse($scope.dataset);
      
      
      alert("First Time: " + $scope.dataset[0].Time);
      alert("First Temp: " + $scope.dataset[0].Temp);
      alert("dataset: " + $scope.dataset);
   }

   $scope.highchartsNG = {
      options: {
         chart: {
            type: 'line'
         },
         xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
               minute: '%H:%M',
               day: '%e. %b',
               year: '%b'
            },
            title: {
               text: 'Time & Date'
            }
         }
      },
      series: [{
         data: $scope.dataset
    }],
      title: {
         text: 'db.name'
      },
      loading: false
   }
});

var newbrew = angular.module('new_brew_app', ["highcharts-ng"]);
newbrew.controller('create_ctrl', function ($scope, $timeout) {
   $scope.chartData = []

   $scope.addPoint = function (point) {
      var data = $scope.highchartsNG.series[0].data
      $scope.highchartsNG.series[0].data = data.concat([[point.time, point.temp]]);
   }

   $scope.schedule = function () {
      alert("Saving this shit to the db: ");
      alert($scope.highchartsNG.series[0].data);
   }

   $scope.highchartsNG = {
      options: {
         chart: {
            type: 'line'
         },
         xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
               minute: '%H:%M',
               day: '%e. %b',
               year: '%b'
            },
            title: {
               text: 'Tim & Date'
            }
         }
      },
      series: [{
         data: $scope.chartData
    }],
      title: {
         text: 'Brew Brew'
      },
      loading: false
   }

});


////get temperatures
//app.controller('tempList', function($scope, $http) {
//	$scope.ListTemperatures = function() {
//		$http({
//			method : 'GET',
//			url : '/Database.js'
//		}).then( function(response) {
//			$scope.TEMP = response.data.results;
//		});
//	}
//});