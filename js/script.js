document.getElementById('header').addEventListener('click',function(){
  var visibilities = ['block', 'none'];
  var currentVis = document.getElementById('legend').style.display;
  console.log(currentVis);
  document.getElementById('legend').style.display = visibilities[visibilities.indexOf(currentVis) + 1] || 'block';
});
