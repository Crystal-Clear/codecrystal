var Mongodb=require('mongodb'),
		MongoClient = Mongodb.MongoClient, //creates a mongo client
		url = 'mongodb://localhost:27017/picup'; // links to your mongo server (note the port) and will operate in the *picup* database (*you can name your database whatever you want)

// create the app object to export
var app = {

	ObjectID: Mongodb.ObjectID,//this is a method from the mongodb module which I will need later in create a user id

	insert: function (data,folder,callback){ // data an array of objects, folder the collection you want to put them in your database, callback what you want to do with the array of data (not necessary...yet)
		MongoClient.connect(url, function(err, db) { //connects to the mongo client using the url, err and db given to you from connect
			console.log("Connected correctly to server"); //little check
			var collection = db.collection(folder); //chooses the collection or creates it with name folder (note folder input must be a string)
			collection.insert(data, function(err, result) { // collection insert method comes form the mongodb module and has this form , err and resutl not used here but have a form true false or number inserted (can't remeber check)
			console.log("Inserted " + data.length + " document(s) into the document collection"); // really should take this number from the result will refactor
			db.close(); //closes db connection for future use by another client
			callback(data);
			});
		});
	},

	read: function (query,projection,folder,callback){ //query is an object like {key1:value1,key2:value2}, projection {key3:true} or {key3:true;_id:false} or {key4:false}, folder colelction we want to access, callback function we use on data returned,
		// query: {key:value} any objects that have property key whose value matches the one given will be returned in the results array. (queries can be more complex ie lessthan greater than... look at the documentation)
		// projection: allows you to choose which part of the returned objects you want, if left empty will return everything but setting keys to false excludes them, whilst settign to true includes and excludes intuitively, note the database object _id will always return unless sent to false
		MongoClient.connect(url, function(err, db) { //connect as before
			console.log("Connected correctly to server"); //blah
			var collection = db.collection(folder); // blah
			collection.find(query,projection).sort({time:-1}).toArray(function(err, results) { //collection find method uses query and projection and returns an array of results
		// sort({time:-1}) sorts the returned results by time -1 says descending (little trick!)
				// console.log("Found the following records");
				// console.log(results);
				db.close(); //closes database
				callback(results); //use your passed in callback on the results
			});
		});
	},

	update: function(query, modificationsObj, folder, callback){
		MongoClient.connect(url, function (err,db) { // see above comments
			console.log("Connected correctly to server"); //blah
			var collection = db.collection(folder); // blah
			console.log(query);
			console.log(modificationsObj);
			collection.update(query,{$set:modificationsObj},{multi:true}, function(err,result){
				if (err){console.log(err);}
				else {
					console.log("Updated " + query._id);
			        db.close();
			        callback();
				}
			});
		});
	}
};


module.exports = app; // export the app with its methods to use elsewhere


//// to come back to later
  // deleter: function (name,collection,callback){
  // 	MongoClient.connect(url, function(err, db) {
  // 	  assert.equal(null, err);
  // 	  console.log("Connected correctly to server");
  // 	  removeDocument(name,db,collection,function(data) {
  //         db.close();
  //         callback(data);
  //       });
  // 	});
  // }
///////
// function removeDocument (name,db,folder,callback) {
// 	var collection = db.collection(folder);
// 	collection.remove(name, function(err, result) {
// 		assert.equal(err, null);
// 		console.log("result is" + result);
// 		callback(result);
// 	});
// }
