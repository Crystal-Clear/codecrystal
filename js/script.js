function createBadge() {
  var owner = document.getElementById('owner').value;
  var repo = document.getElementById('repo').value;
  var branch = document.getElementById('branch').value || "master";
  if (!owner){return alert("No username or organisation supplied");}
  if (!repo){return alert("No repo supplied");}
  var repoPath =  owner + '/' + repo + '/' + branch;
  var linkToCrystal = 'www.codecrystal.herokuapp.com/crystal/' + repoPath;

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.responseText){return alert(xhr.responseText);}
      else {
        document.getElementById("badgeLink").innerHTML = '[![Codecrystal](https://img.shields.io/badge/code-crystal-5CB3FF.svg)](' + linkToCrystal + ')';
        document.getElementById("badgeHolder").innerHTML = '<a href='+ linkToCrystal +'><img alt="codecrystal badge" src="/static/images/badge.svg"></a>';
      }
    }
  };
  xhr.open('GET', '/create/' + repoPath);
  xhr.send();

}
