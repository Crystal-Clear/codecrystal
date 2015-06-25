//takes in a character and cehcks to see if alphanumeric returning true if so or false otherwise
function isAlphaNumeric(character){
  var charCode=character.charCodeAt(0); //finds character code of character
  if (!(charCode > 47 && charCode < 58) && // numeric (0-9)
      !(charCode > 64 && charCode < 91) && // upper alpha (A-Z)
      !(charCode > 96 && charCode < 123) ) { // lower alpha (a-z)
      return false;
  } else {return true;}
}

// gets the contents of require brackets
function reqInside (string) {
  var rightParInd=string.indexOf(')'); // finds index od end
  return (string.charCodeAt(0)===40) && rightParInd>-1 ? string.slice(1,rightParInd) : ""; //check to see if first character is indeed the left parathensis and that a right paraenthesis exists, if so return in between else an empty string
}


// remove spaces and line breaks and comments!
function removeWhiteComment(string){
  return string.split(/\r\n|\n|\r/).map(function(line){return line.split('//')[0];}).join('').replace(/\s+/g, ''); // splits text by line breaks (note three types), then for each line split by "//" and take the first part, ie the content before comments and then join all those parts back up and remove spaces " "
}

var parser = {};

// takes in all text from a javascript file and returns an array of links found in require() calls
parser.insideRequires = function (programText){
  var links=[]; //intialise link array
  var noWhiteComment=removeWhiteComment(programText); // removes all line breaks and spaces
  var requires = noWhiteComment.split('require'); //split on require
  // console.log(requires);
  for (var i=1; i<requires.length;i++){ //for all the requires
      var link = requires[i-1].slice(-1) && !isAlphaNumeric(requires[i-1].slice(-1)) ? reqInside(requires[i]) : ''; //for each part of the split looks at the last character from the previous part and checks whether it doesn't exist or alphanumeric if so ignore it as not a proper require call returning an empty string, else return the content inside the brackets after the require
      if (link) {links.push(link.slice(1,-1));} // if not an empty string push onto links array
  }
  return links; //return results
};

// from the link array and the currentfile path relative to the root
// returns link path array relative to the root directory
// adds .js to each if needed
// also if external no file path just the name of the npm module
parser.pathFinder = function(linkArr,currentFile){ // current file example '/folder1/folder2/mongo.js' or '/server.js'
  // return linkArr.map(function(link){
  //   if (link.indexOf('/') !== -1){
  //     link = link.indexOf('.js') !== -1 ? link : link + '.js';
  //     var dir = currentFile.split('/').slice(0,-1);
  //     var segments = link.split('/');
  //     if (segments[0] !== '..'){segments = segments.slice(1);}
  //     return segments.reduce(function(pathToLink, pathSection){
  //       if (pathSection === '..') {return pathToLink.slice(0,-1);}
  //       if (pathSection === '.') {return pathToLink;}
  //       return pathToLink.concat([pathSection]);
  //     }, dir).join('/');
  //   } else {return link;}
  // });
  return linkArr.map(function(link){
    if (link.indexOf('/') !== -1){
      link = link.indexOf('.js') !== -1 ? link : link + '.js';
      if (link[0]!=='.'){return link;}
      var dir = currentFile.split('/');
      var segments = link.split('/');
      var numOfDots=segments[0].length;
      var pathArr=dir.slice(0,-numOfDots).concat(segments.slice(1));
      return pathArr.join('/');
    } else {return link;}
  });
};


module.exports = parser;
