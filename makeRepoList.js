module.exports = function (repoArray, orgRepoArry) {

  console.log('repoArray', repoArray);
  // var repos = repoArray.map(function(elem) { return elem[0]; });

  var makeRepoListString = repoArray.map(function(repo) { return makeRepoButton(repo);});

  function makeRepoButton(repo) {
    return '<button class="repoButton"><a href=/graph/' + repo[0] + "/" + repo[1] + '>' + repo[0].split('/').pop() + '</a></button>';
  }

  var htmlTop = '<!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="/static/css/main.css"><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,600" rel="stylesheet" type="text/css"><meta name="viewport" content="initial-scale = 1.0, maximum-scale = 1.0"/></head><body><div id="content"><h1>Choose your GitHub repos<h1><div id="repoList">';

  var htmlBottom = '</div></div><script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script></body></html>';

  return (htmlTop + makeRepoListString.join('') + htmlBottom);

};
