"use strict";

/*global define:true */

(function( factory ) {

	factory = factory();

	if ( typeof define === "function" && define.amd ) {
		define('date_diff', [], factory );
	}else if ((typeof module !== 'undefined' && module.exports)){
		module.exports = factory;
	}else{
		this.date_diff = factory;
	}

}(function() {

	var date_diff_format = function(time_unit, unit) {
			var total = 0,
				time_format = {
					y : function(){
						total += 0;
					},
					M : function(){
						total += (total + time_unit.y) * 12;
					},
					d : function(){
						total += (total + time_unit.M) * 30.44;
					},
					h : function(){
						total += (total + time_unit.d) * 24;
					},
					m : function(){
						total += (total + time_unit.h) * 60;
					},
					s : function(){
						total += (total + time_unit.m) * 60;
					}
				},
				time_format_key = Object.keys(time_format);

			time_format_key.some(function(key, index){

				time_format[key]();

				index > 0 && (time_unit[ time_format_key[index - 1] ] = 0);

				if(key === unit){
					time_unit[key] += parseInt(total);
					return true;
				}

			});

		},

		/*
		*http://www.epochconverter.com/
		*Human readable time 	Seconds
		*1 hour	3600 seconds
		*1 day	86400 seconds
		*1 week	604800 seconds
		*1 month (30.44 days) 	2629743 seconds
		*1 year (365.24 days) 	 31556926 seconds
		*/
		date_diff = function(ms, max_unit) {


			var floor = Math.floor,
				seconds = ms / 1000,
				hour_s = 3600,
				day_s = 86400,
				year_s = 31556926,

				rest_day_s = seconds % year_s,
				rest_hour_s = rest_day_s % day_s,
				rest_min_s = rest_hour_s % hour_s,

				format_days = floor(rest_day_s / day_s),
				format_month = floor(format_days / 30.44);

			var normal_result = {
				y : floor(seconds / year_s),
				M : format_month,
				d : floor(format_days - (format_month * 30)),
				h : floor(rest_hour_s / 3600),
				m : floor(rest_min_s / 60),
				s : rest_min_s % 60
			};

			max_unit && date_diff_format(normal_result, max_unit);

			return  normal_result;

		};


	//new Date('2017/6/5 10:20') -  new Date('2015/5/12 5:10')
	console.assert(
		JSON.stringify(date_diff(65250600000)) === '{"y":2,"M":0,"d":24,"h":17,"m":32,"s":28}',
		'正常月份'
	);

	// new Date('2016/5/5') -  new Date('2015/5/5')
	console.assert(
		JSON.stringify(date_diff(31622400000, 'y')) === '{"y":1,"M":0,"d":0,"h":18,"m":11,"s":14}',
		'年判断出错'
	);

	console.assert(
		JSON.stringify(date_diff(31536003000, 'M')) === '{"y":0,"M":11,"d":35,"h":0,"m":0,"s":3}',
		'月判断出错'
	);

	console.assert(
		JSON.stringify(date_diff(31536003000, 'd')) === '{"y":0,"M":0,"d":369,"h":0,"m":0,"s":3}',
		'天判断出错'
	);

	console.assert(
		JSON.stringify(date_diff(31536003000, 'h')) === '{"y":0,"M":0,"d":0,"h":9211,"m":0,"s":3}',
		'小时判断出错'
	);

	console.assert(
		JSON.stringify(date_diff(31536003000, 'm')) === '{"y":0,"M":0,"d":0,"h":0,"m":561871,"s":3}',
		'分钟判断出错'
	);

	console.assert(
		JSON.stringify(date_diff(31536003000, 's')) === '{"y":0,"M":0,"d":0,"h":0,"m":0,"s":34274134}',
		'秒判断出错'
	);

	return date_diff;

}));
