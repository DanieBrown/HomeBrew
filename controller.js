/* Controller */
var chart_view = angular.module('chart_view_module', ["highcharts-ng"]);

chart_view.controller('monitor_ctrl', function ($scope, $timeout, $http) {
   var current_brew = [];
   var water_readings = [];
   var room_readings = [];
   var heating = [];
   var cooling = [];

   // populate graph with currently scheduled brew.
   $http.get('/getCurrentSchedule').success(function (response) {
      for (i = 0; i < response.length; i++) {
         var now = new Date(response[i].Time);
         var time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
         current_brew.push([time, response[i].Temp]);
      }
   });

   // populate graph with currently scheduled brew.
   $http.get('/getSensorData').success(function (response) {
      for (i = 0; i < response.length; i++) {
         var now = new Date(response[i].Time);
         var time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

         if (response[i].Sensor === 'water') {
            // populate heating area chart
            if (response[i].Heating === 1) {
               heating.push([time, response[i].Temp]);
            } else {
               heating.push([time, null]);
            }

            // populate heating area chart
            if (response[i].Cooling === 1) {
               cooling.push([time, response[i].Temp]);
            } else {
               cooling.push([time, null]);
            }
            water_readings.push([time, response[i].Temp]);
         } else if (response[i].Sensor === 'room') {
            room_readings.push([time, response[i].Temp]);
         }

      }
   });

   setInterval(function () {
      $http.get('/getSensorData').success(function (response) {
         if (water_readings.length !== response.length) {
            for (i = water_readings.length - 1; i < response.length; i++) {
               var now = new Date(response[i].Time);
               var time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
               if (response[i].Sensor === 'water') {
                  // populate heating area chart
                  if (response[i].Heating === 1) {
                     heating.push([time, response[i].Temp]);
                  } else {
                     heating.push([time, null]);
                  }

                  // populate heating area chart
                  if (response[i].Cooling === 1) {
                     cooling.push([time, response[i].Temp]);
                  } else {
                     cooling.push([time, null]);
                  }
                  water_readings.push([time, response[i].Temp]);
               } else if (response[i].Sensor === 'room') {
                  room_readings.push([time, response[i].Temp]);
               }

            }
         }
      });
   }, 850);

   $scope.highchartsNG = {
      options: {
         //         chart: {
         //            type: 'line'
         //         },
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
         yAxis: {
            title: {
               enabled: true,
               text: 'Degrees Fahrenheit',
               style: {
                  fontWeight: 'normal'
               }
            }
         },
         tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%H:%M:%S"}: {point.y} °F'
               // pointFormat: '{point.x:%A, %b %e, %H:%M"}: {point.y:.2f} °F'
         }
      },
      series: [{
         type: 'spline',
         name: 'Brew Schedule',
         data: current_brew
    }, {
         type: 'line',
         name: 'Water Temperature',
         data: water_readings
    }, {
         type: 'line',
         name: 'Room Temperature',
         data: room_readings
    }, {
         type: 'area',
         color: '#FA8072',
         name: 'Heating',
         data: heating
    }, {
         type: 'area',
         color: '#87CEEB',
         name: 'Cooling',
         data: cooling
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
      var now = new Date(point.time);
      var time = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

      $scope.highchartsNG.series[0].data = data.concat([[time, point.temp]]);
      var newJsonPoint = [{
         "Time": time,
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
         data: $scope.chartData
    }],
      title: {
         text: 'Next Brew'
      },
      loading: false
   }

});