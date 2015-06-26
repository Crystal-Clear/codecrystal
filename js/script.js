document.getElementById('header').addEventListener('click',function(){
  var visibilities = ['block', 'none'];
  var currentVis = document.getElementById('legend').style.display;
  console.log(currentVis);
  document.getElementById('legend').style.display = visibilities[visibilities.indexOf(currentVis) + 1] || 'block';
});


$('body').on('mouseover','.repoLink', function() {
  console.log(this.href);
  document.getElementById('badgeLink').innerHTML = '[![Codecrystal](https://img.shields.io/badge/code-crystal-5CB3FF.svg)](' + this.href + ')';
});
