var R = require('ramda');

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
  return string[0]==='(' && rightParInd>-1 ? string.slice(1,rightParInd) : ""; //check to see if first character is indeed the left parathensis and that a right paraenthesis exists, if so return in between else an empty string
}

function notEscaped(char, desired, previous){
  return char === desired && previous !== '\\';
}

// removes all comments form javascript file
function removeComments(fileText){
  //thanks to james.padolsey.com
  var charray = ('__' + fileText + '__').split('');

  var nonCommentModes = {
    singleQuote: [false, "'"],
    doubleQuote: [false, '"'],
    regex: [false, "\\"],
  };

  var commentModes = {
    blockComment: [false, '*'],
    lineComment: [false, '/'],
  };

  var functions = [];

  function notEscaped (char, expected, index){
    return char === expected && charray[i-1] !== '\\';
  }

  function modeStart(expected, i){
    return charray[i+1] === expected;
  }

  Object.keys(nonCommentModes).forEach(function(m){
    functions.push(function(char, index){
      if (nonCommentModes[m][0]){
        if (notEscaped(char, nonCommentModes[m][1], index)){
          nonCommentModes[m][0] = false;
          return true;
        }
      }
    });
  });

  functions.push(function(char, i){
    var result = false;
    if (commentModes.blockComment[0]){
      if (charray[i] === '*' && charray[i+1] === '/'){
        charray[i+1] = '';
        commentModes.blockComment = false;
        result = true;
      }
      charray[i] = '';
    }
    return result;
  });

  functions.push(function(char, i){
    var result = false;
    if (commentModes.lineComment[0]){
      if (char === '\n' || char === '\r'){
        commentModes.lineComment = false;
        result = true;
      }
      charray[i] = '';
    }
    return result;
  });

  functions.push(function(char, i){
    nonCommentModes.doubleQuote = char === '"';
    nonCommentModes.singleQuote = char === "'";
  });

  functions.push(function(char, index){
    if (char === '/'){
    if (Object.keys(commentModes).some(function(m){
      if (charray[index+1] === commentModes[m][1]){
        charray[index] = '';
        commentModes[m][0] = true;
        return true;
      }
    })) {return true;}
    else {nonCommentModes.regex = true;}
    }
  });

  charray.forEach(function(char,index){
    functions.some(function(func){
      return func(char,index);
    });
  });

  return charray.join('').slice(2, -2);
}

function dealWithDots(segment){
  return segment.slice(0, -segment.length);
}

var parser = {};

// takes in all text from a javascript file and returns an array of links found in require() calls
parser.insideRequires = function (programText){
  var links=[]; //intialise link array
  var noComments = removeComments(programText);
  var noWhite = noComments.replace(/\r\n|\n|\r|\s+/g, ''); // removes all line breaks and spaces
  var requires = noWhite.split('require'); //split on require
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
parser.pathFinder = function (linkArr,currentFile){ // current file example '/folder1/folder2/mongo.js' or '/server.js'
  return linkArr.map(function(lInK){
    var link=lInK.toLowerCase();
    if (link.indexOf('/') !== -1){
      var dir = currentFile.split('/').slice(0,-1);
      var segments = link.split('/');
      var last= segments.pop();
      if (last && last.indexOf('.js')===-1){last+='.js';}
      segments.push( last || 'index.js');
      if (!segments[0]){dir = [];}
      return segments.reduce(function(pathToLink, pathSection){
        if (pathSection === '..') {return pathToLink.slice(0,-1);}
        if (pathSection === '.') {return pathToLink;}
        return pathToLink.concat([pathSection]);
      }, dir).join('/');
    } else {return link;}
  });
};

module.exports = parser;
