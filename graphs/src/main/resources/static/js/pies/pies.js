angular.module('pies', [ 'n3-pie-chart' ]).factory('piesService', function() {

	var service = {};

	service.options = {
		thickness : 50
	};

	service.features = {
		palette : 'colorwheel'
	};

	var metadata = [ {
		title : 'Send Counts',
		prefix : '.*integration\\.channel\\..*\\..*Rate.count',
		exclude : '.*nullChannel.*|.*errorChannel.*'
	}, {
		title : 'Request Counters',
		prefix : 'counter\\.status.*'
	}, {
		title : 'Dependencies',
		prefix : '.*\\initializr.dependency.*'
	}, {
		title : 'Boot Versions',
		prefix : '.*\\initializr.boot_versions.*'
	}, {
		title : 'Java Version',
		prefix : '.*\\initializr.java_version.*'
	} , {
		title : 'Language',
		prefix : '.*\\initializr.language.*'
	} , {
		title : 'Packaging',
		prefix : '.*\\initializr.packaging.*'
	} , {
		title : 'Type',
		prefix : '.*\\initializr.type.*'
	} ];

	var hits = {};
	var cache = {};
	var discards = {};

	service.pies = {};
	var names = {};
	service.reset = function() {
		service.pies = {};
		cache = hits;
		hits = {};
		names = {};
	}

	service.add = function(key, x, value) {

		if (!hits[key] && !discards[key]) {
			$.each(metadata, function(index, item) {
				var prefix = item.prefix;
				var exclude = item.exclude;
				if (key.match(prefix) && (!exclude || !key.match(exclude))) {
					hits[key] = {
						title : item.title,
						name : key,
						value : value
					};
				}
			})
			if (!hits[key]) {
				discards[key] = true;
			}
		}
	};

	service.update = function() {
		var pies = service.pies;
		$.each(hits, function(key, value) {
			var name = value.name;
			var title = value.title;
			var data = value.value;
			if (!names[name] && data>0) {
				pies[title] = pies[title] || [];
				pies[title].push({
					label : name,
					value : data
				});
				names[name] = {
					title : title,
					value : data
				};
			}
		});
		$.each(pies, function(title, data) {
			var palette = new Rickshaw.Color.Palette({
				scheme : service.features.palette
			});
			$.each(data, function(index, map) {
				data[index] = {
					label : map.label,
					color : palette.color(),
					value : map.value
				};
			});
		});
	}

	return service;

});
