var fs = require('fs');
var text = fs.readFileSync('./handlers.js').toString();

function requireparser(program){
  links=[];
  var requires = program.split('require(');
  for (var i=1; i<requires.length;i++){
    links.push(requires[i].split(')')[0].slice(1,-1));
  }
  return links;
}

console.log(requireparser(text));
