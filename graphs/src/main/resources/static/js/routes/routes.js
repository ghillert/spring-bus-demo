angular.module('routes', []).factory('routeService', function($http) {
	var service = {};
	// Special cases of well-known apps we know have nested admin path (in
	// principle this information is available from the server via Eureka)
	var paths = {configserver: "admin/"};
	service.route = {
		name : 'local',
		path : ''
	};
	service.routes = [ service.route ];
	$http.get("routes").success(function(data) {
		$.each(data, function(key, value) {
			var route = key.substring(1);
			var index = route.indexOf('/**');
			if (index > 0) {
				route = route.substring(0, index);
			}
			var path = route + '/';
			if (paths[route]) {
				path = path + paths[route];
			}
			service.routes.push({
				name : route,
				path : path
			});
		})
	});
	return service;
});
