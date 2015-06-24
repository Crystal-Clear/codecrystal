var teststring="the\npoop eats lines";



function removeWhite(string){
  return string.replace(/(\r\n|\n|\r|\s)/gm,"");
}

console.log(teststring.slice(1,-1))
;
