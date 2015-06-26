module.exports = function (repoArray, orgRepoArray) {

  // console.log('orgRepoArray', orgRepoArray);
  // var repos = repoArray.map(function(elem) { return elem[0]; });

  var makeUserRepoListString = repoArray.map(function(repo) { return makeRepoButton(repo);});

  var makeOrgRepoListString = orgRepoArray.map(function(org) { return makeOrgButtons(org); });

  function makeRepoButton(repo) {
    return '<button class="repoButton"><a href=/graph/' + repo[0] + "/" + repo[1] + '>' + repo[0].split('/').pop() + '</a></button>';
  }

  function makeOrgButtons(org) {
    var orgButtons = '<div class="org"><div class="orgName">' + org.org + '</div>';
    // console.log(org);
    org.repos.forEach(function(repo) {
      orgButtons += '<button class="repoButton"><a href=/graph/' + org.org + "/" + repo[0] + "/" + repo[1] + '>' + repo[0] + '</a></button>';
    });
    return orgButtons + '</div>';
  }

  var htmlTop = '<!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="/static/css/main.css"><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400,600" rel="stylesheet" type="text/css"><meta name="viewport" content="initial-scale = 1.0, maximum-scale = 1.0"/></head><body><div id="content"><h1>Choose your GitHub repos<h1><div id="repoList">';

  var htmlBottom = '</div></div><script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script></body></html>';

  return (htmlTop + makeUserRepoListString.join('') + makeOrgRepoListString.join('') + htmlBottom);

};
