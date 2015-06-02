angular.module('app', [ 'routes', 'series', 'pies' ]).controller(
		'home',
		function($scope, $interval, $http, routeService, seriesService, piesService) {

			$scope.resetOnNext = false;
			$scope.reset = function() {
				$scope.resetOnNext = true;
			}
			var reset = function() {
				seriesService.reset();
				piesService.reset();
			}

			$scope.routes = routeService;
			$scope.x = 0;
			$scope.series = seriesService;
			$scope.pies = piesService;

			var updateSeries = function() {

				$http.get(routeService.route.path + "metrics").success(
						function(metrics) {
							$.each(metrics, function(key, value) {
								seriesService.add(key, $scope.x, value);
								piesService.add(key, $scope.x, value);
							});
							seriesService.update();
							piesService.update();
							$scope.x++;
						});

			};
			updateSeries();

			$scope.toggleCollect = function() {
				$scope.collect = !$scope.collect;
				if ($scope.collect) {
					if ($scope.resetOnNext) {
						updateSeries();
					}
					$scope.interval = $interval(function() {
						if ($scope.resetOnNext) {
							reset();
							$scope.resetOnNext = false;
						}
						updateSeries();
					}, 1000);
				} else
					$interval.cancel($scope.interval);
			}
		});
