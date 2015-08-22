function createBadge() {
  var owner = document.getElementById('owner').value;
  var repo = document.getElementById('repo').value;
  var branch = document.getElementById('branch').value || "master";
  if (!owner){return alert("No username or organisation supplied");}
  if (!repo){return alert("No repo supplied");}
  var repoPath =  owner + '/' + repo + '/' + branch;
  var linkToCrystal = 'http://codecrystal.herokuapp.com/crystalise/' + repoPath;
  document.getElementsByClassName("show-badge")[0].style.display = "block";
  document.getElementsByClassName("badgeLink")[0].innerHTML = '[![Codecrystal](https://img.shields.io/badge/code-crystal-5CB3FF.svg)](' + linkToCrystal + ')'; //change image link
  document.getElementsByClassName("badgeHolder")[0].innerHTML = '<a href='+ linkToCrystal +'><img alt="codecrystal badge" src="/static/images/badge.svg"></a>';
}
