/* Controller */
var chart_view = angular.module('chart_view_module', ["highcharts-ng"]);

chart_view.controller('monitor_ctrl', function ($scope, $timeout, $http) {
   var dataset = [];


   $http.get('/getCurrentSchedule').success(function (response) {
      for (i = 0; i < response.length; i++) {
         dataset.push([response[i].Time, response[i].Temp]);
      }
   });

   setInterval(function () {
      var last_dataset = dataset.slice();
      //      dataset.length = 0;

      $http.get('/getCurrentSchedule').success(function (response) {
         if (dataset.length !== response.length) {
            for (i = dataset.length - 1; i < response.length; i++) {
               dataset.push([response[i].Time, response[i].Temp]);
            }
         }
      });
   }, 3000);

   $scope.highchartsNG = {
      options: {
         chart: {
            type: 'line'
         },
         xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
               minute: '%H:%M',
               hour: '%H:%M',
               day: '%e. %b'
//               year: '%Y'
            },
            tickPixelInterval: 100,
            title: {
               text: 'Time & Date'
            }
         }
      },
      series: [{
         data: dataset
    }],
      title: {
         text: 'db.name'
      },
      loading: false
   }
});

var newbrew = angular.module('new_brew_app', ["highcharts-ng"]);
newbrew.controller('create_ctrl', function ($scope, $timeout, $http) {
   $scope.chartData = [];
   var jsonData = [];

   $scope.addPoint = function (point) {
      var data = $scope.highchartsNG.series[0].data
      $scope.highchartsNG.series[0].data = data.concat([[point.time, point.temp]]);
      var newJsonPoint = [{
         "Time": point.time,
         "Temp": point.temp
      }];
      jsonData = jsonData.concat(newJsonPoint);
   }

   $scope.schedule = function () {
      $http.post('/postNewSchedule', jsonData);
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