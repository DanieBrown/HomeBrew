/* Controller */
var chart_view = angular.module('chart_view_module', ["highcharts-ng"]);

chart_view.controller('monitor_ctrl', function ($scope, $timeout, $http) {
   var current_brew = [];
   var live_readings = [];
   //   $scope.current_water_temp;

   // populate graph with currently scheduled brew.
   $http.get('/getCurrentSchedule').success(function (response) {
      for (i = 0; i < response.length; i++) {
         var now = new Date(response[i].Time);
         var time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
         current_brew.push([time, response[i].Temp]);
      }
      alert(current_brew);
   });

   // populate graph with currently scheduled brew.
   $http.get('/getSensorData').success(function (response) {
      for (i = 0; i < response.length; i++) {
         var now = new Date(response[i].Time);
         var time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
         live_readings.push([time, response[i].Temp]);
      }
   });

   setInterval(function () {
      $http.get('/getSensorData').success(function (response) {
         if (live_readings.length !== response.length) {
            for (i = live_readings.length - 1; i < response.length; i++) {
               var now = new Date(response[i].Time);
               var time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
               live_readings.push([time, response[i].Temp]);
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
            labels: {
               format: '{value:%H:%M:%S}',
               rotation: 45,
               align: 'left'
            },
            title: {
               text: 'Time & Date'
            }
         },
         tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%H:%M:%S"}: {point.y} °F'
         // pointFormat: '{point.x:%A, %b %e, %H:%M"}: {point.y:.2f} °F'
         }
      },
      series: [{
         name: 'Brew Schedule',
         data: current_brew
    }, {
         name: 'Water Temperature',
         data: live_readings
    }],
      title: {
         text: 'All the data you will ever need...'
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
               text: 'Time & Date'
            }
         }
      },
      series: [{
         data: $scope.chartData
    }],
      title: {
         text: 'New Brew'
      },
      loading: false
   }

});