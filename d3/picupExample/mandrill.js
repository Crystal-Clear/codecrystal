var mandrill = require("mandrill-api/mandrill");
var mandrill_client = new mandrill.Mandrill(process.env.SECRET);

var email = {};

email.sendEmail = function (userObj) {
	var data = {
	      	'from_email': 'abdicagaros@gmail.com',
	      	'to': [
	          {
	            'email': userObj.email,
	            'name': userObj.firstname,
	            'type': 'to'
	          }
	        ],
		      'autotext': 'true',
		      'subject': 'Thanks for signing up',
		      'html': '<p>Thank you '+ userObj.firstname +' have now signed up to ranstagram app on ' +userObj.signUpTime+'. Please validate your email by clicking the following link:</p><a href="localhost:8000/validate/'+ userObj._id+'">Validate</a>'
	};
	mandrill_client.messages.send({"message": data, "async": false},function(result) {
		console.log(result);
	}, function(e) {
		console.log("Error " + e.message);
	});
};

module.exports = email;
