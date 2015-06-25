var fs = require('fs');

var analytics = {

	readRequireLog: function (object, callback){	
		var obj=[];
		var counter = {};
		var logVisitors = {};
		var returnString = '<h1>Site call counter</h1>';
		var returnUserString = '<p></p><h1>Unique visitors counter</h1>';
		var theEnd = '';
		fs.readFile(__dirname +'/src/log/response_log', 'utf8', function (err, data) {//derp-fault: switched arguments -> wasted 3,5h
	  		if (err) throw err;

	  		obj = data.split(/\r?\n/);
			for(var i=0;i<obj.length;i++){
				var thing = obj[i];
				if (thing){
				    try{
				        var a=JSON.parse(thing);
				    }catch(e){
				        alert(e); //always use try / catch for JSON.parse!!!!!!!!!!!!!!!!!
				    }
				}
				if (!counter[a.path]){
					counter[a.path] = 1 ;
				}
				else {
					counter[a.path]++;
				}
				if (!logVisitors[a.source.remoteAddress]){
					logVisitors[a.source.remoteAddress] = a.timestamp;
					console.log("new Visitor registered");
				}
				else {
					if (logVisitors[a.source.remoteAddress] > a.timestamp - 300000 ){
					logVisitors[a.source.remoteAddress] = a.timestamp;
					console.log("replacing timestamp, last click less than 30 minutes ago");
					}
					else {
					logVisitors[a.source.remoteAddress] += "," +a.timestamp;
					console.log("adding timestamp, last click more than 30 minutes ago!!!");						
					}
				}
			}

			for(var user in logVisitors){
				if (logVisitors.hasOwnProperty(user)){
					var times = logVisitors[user].split(',');
					returnUserString += '<p><strong> Ip-adress: ' + user + '</strong> has accessed picup.com <i>' + times.length + '</i> times</p>';
					// var p = logVisitors[a.source.remoteAddress];
					// console.log(p);
				}
			}

			for(var key in counter){
				if (counter.hasOwnProperty(key)){
					returnString += '<p><strong>www.picup.com' + key + '</strong> has been accessed <i>'+ counter[key] +'</i> times.</p>';
				}
			}
			theEnd = returnString + returnUserString;
			callback(theEnd,null);
		});
	},

};
module.exports = analytics;