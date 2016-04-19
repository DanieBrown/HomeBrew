/* Controller */
var chart_view = angular.module('chart_view_module', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

// Directive for generic chart, pass in chart options
chart_view.directive('hcChart', function () {
   return {
      restrict: 'E',
      template: '<div></div>',
      scope: {
         options: '='
      },
      link: function (scope, element) {
         Highcharts.chart(element[0], scope.options);
      }
   };
});

var new_brew_dates;
chart_view.run(function ($http) {
   $http({
      method: 'GET',
      url: '/getTime'
   }).then(function (response) {
      new_brew_dates = response.data;
   });
});

chart_view.controller('monitor_ctrl', function ($scope) {

   // Sample options for first chart
   $scope.chartOptions = {
      title: {
         text: 'Your Current Brew'
      },
      xAxis: {
         categories: new_brew_dates
      },
      chart: {
         renderTo: 'container',

         margin: [0, 0, 0, 0],
         spacingTop: 0,
         spacingBottom: 0,
         spacingLeft: 0,
         spacingRight: 0
      },

      series: [{
         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
					216.4, 194.1, 95.6, 54.4]
		}]
   };
}); // end monitor_ctrl

chart_view.controller('creator_ctrl', function ($scope) {
   // Sample options for first chart
   $scope.chartOptions = {
      title: {
         text: 'new_profile.getName()'
      },
      xAxis: {
         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
					'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            // categories = creator_categories + input_ctrl.response.newDate
      },

      series: [{
         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
					216.4, 194.1, 95.6, 54.4]
		}]
   };
});

chart_view.controller('date_ctrl', function ($scope) {
   $scope.myDate = new Date();

   $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() - 2,
      $scope.myDate.getDate());

   $scope.maxDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() + 2,
      $scope.myDate.getDate());

   $scope.onlyWeekendsPredicate = function (date) {
      var day = date.getDay();
      return day === 0 || day === 6;
   }
});

chart_view.controller('input_ctrl',
   function ($scope /*,$http*/ ) {
      //$http.get("/Simplex_1/SearchFood").then(
      $scope.getNewTemp = function (new_brew_dates) {
         var point = {
            temp: $scope.t1,
            date: $scope.t2
         };
         new_brew_dates.add(point.temp);

         /*$http({
				method: 'POST',
				url: '/Simplex_1/SearchFood',
				params: {temp: $scope.t1, date:$scope.t2}
			}).then(
	    		function(response) {
	        		$scope.myData = response.data.results;
	        		// 
	    		}
	    	);*/
      }
   }
);

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

   $scope.concat2D = function (add) {
      var orig = $scope.highchartsNG.series[0].data
      add.concat()
      return add;
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
app.controller('ctrl03', function($scope, $http) {
	$http({
		method : 'GET',
		url : '/getTemp'
	}).then( function(response) {        
		$scope.t = response.data;
	});
});





// app.controller('ctrl02', function($scope, $http) {
//    $http({
//        method : 'GET',
//        url : '/getTemp'
//    }).then( function(response) {        
//        $scope.t = response.data;
//    });
//});

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