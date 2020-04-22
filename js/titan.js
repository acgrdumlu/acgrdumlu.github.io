// Titan Progress

var date = new Date();
var od = new Date("04/19/2020");
var edd = new Date("05/27/2020");

var totalDate = Math.floor((edd.getTime() - od.getTime()) / (1000 * 3600 * 24))
var diff = Math.floor((edd.getTime() - date.getTime()) / (1000 * 3600 * 24));

var percentage = ((totalDate - diff) / totalDate) * 100;  


document.querySelector('.count').textContent = diff;
document.querySelector('.progress-bar').style.width = (percentage + "%");
