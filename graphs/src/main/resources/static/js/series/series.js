angular.module('series', [ 'angular-rickshaw' ]).factory(
		'seriesService',
		function() {

			var service = {};

			service.options = {
				renderer : 'line',
				height : 100
			};

			service.features = {
				xAxis : {},
				yAxis : {
					tickFormat : 'formatKMBT'
				},
				hover : {
					xFormatter : function(x) {
						return 't=' + x;
					},
					yFormatter : function(y) {
						return y;
					}
				},
				legend : {
					toggle : true,
					highlight : true
				},
				palette : 'colorwheel'
			};

			var metadata = [ {
				title : 'Channel Rates',
				prefix : '.*integration\\.channel\\..*\\..*Rate.mean',
				exclude : '.*nullChannel.*|.*errorChannel.*'
			}, {
				title : 'Handlers',
				prefix : '.*integration\\.handler\\..*\\.duration\\.mean'
			}, {
				title : 'Response Times',
				prefix : 'gauge\\.response.*'
			}, {
				title : 'Memory Usage',
				prefix : 'mem.*'
			} ];

			var hits = {};
			var cache = {};
			var discards = {};

			service.series = {};
			var names = {};
			service.reset = function() {
				service.series = {};
				cache = hits;
				hits = {};
				names = {};
			}

			service.add = function(key, x, value) {

				if (!hits[key] && !discards[key]) {
					$.each(metadata, function(index, item) {
						var prefix = item.prefix;
						var exclude = item.exclude;
						if (key.match(prefix)
								&& (!exclude || !key.match(exclude))) {
							hits[key] = {
								title : item.title,
								name : key,
								data : cache[key] ? cache[key].data : []
							};
						}
					})
					if (!hits[key]) {
						discards[key] = true;
					}
				}
				if (hits[key]) {
					var data = hits[key].data;
					data.push({
						x : x,
						y : value
					});
					if (data.length > 100) {
						data.splice(0, 1);
					}
				}
			};

			service.update = function() {
				var series = service.series;
				$.each(hits, function(key, value) {
					var name = value.name;
					var title = value.title;
					var data = value.data;
					if (!names[name]) {
						series[title] = series[title] || [];
						series[title].push({
							name : name,
							data : data
						});
						names[name] = {
							title : title,
							data : data
						};
					}
				});
				$.each(series, function(title, data) {
					// To ping the $watch on the series data in
					// rickshaw-angular we have to force a change
					$.each(data, function(index, map) {
						data[index] = {
							name : map.name,
							color : map.color,
							data : map.data
						};
					});
				});
			}

			return service;

		});
