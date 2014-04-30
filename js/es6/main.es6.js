/* global google:true */
/* jshint unused:false */
/* jshint camelcase:false*/
/* global AmCharts:true */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    initMap(40, -95, 4);
    $('#add').click(add);
  }

  function add(){
    addToMap();
    addWeatherGraph();
  }

  function addWeatherGraph(){
    let location = $('#location').val();
    let url = 'http://api.wunderground.com/api/80d7e4749cbf760e/forecast10day/q/'+location+'.json?callback=?';
    $.getJSON(url, getWeather);
  }

  function getWeather(data){
    let zip = $('#location').val();
    $('#graphs').append('<div class=graph data-zip='+zip+'></div>');
    makeChart(zip);
    for(let i = 0; i < 10; i++){
      let high = data.forecast.simpleforecast.forecastday[i].high.fahrenheit;
      let low = data.forecast.simpleforecast.forecastday[i].low.fahrenheit;
      let day = data.forecast.simpleforecast.forecastday[i].date.weekday;

      chart[zip].dataProvider.push({
        day: day,
        high: high,
        low: low,
      });
    }
    chart[zip].validateData();
  }

  function addToMap(){
    let location = $('#location').val();
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: location}, (results, status)=>{
      let name = results[0].formatted_address;
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name);
    });
  }

  function addMarker(lat, lng, name){
    let latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name,});
  }

  var map;
  function initMap(lat, lng, zoom){
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  var chart={};
  function makeChart(zip){
    let graph = $('.graph[data-zip='+zip+']')[0];
    chart[zip] = AmCharts.makeChart(graph, {
        'type': 'serial',
        'theme': 'dark',
        'titles': [{
          'text': zip,
          'size': 15
        }],
        'pathToImages': 'http://www.amcharts.com/lib/3/images/',
        'legend': {
            'useGraphSettings': true
        },
        'dataProvider': [],
        'valueAxes': [{
            'id':'v1',
            'minimum': 0,
            'maximum': 100,
            'axisColor': '#FF6600',
            'axisThickness': 2,
            'gridAlpha': 0,
            'axisAlpha': 1,
            'position': 'left'
        }],
        'graphs': [{
            'valueAxis': 'v1',
            'lineColor': '#FF6600',
            'bullet': 'round',
            'bulletBorderThickness': 1,
            'hideBulletsCount': 30,
            'title': 'Highs',
            'valueField': 'high',
    		'fillAlphas': 0
        }, {
            'valueAxis': 'v1',
            'lineColor': '#FCD202',
            'bullet': 'square',
            'bulletBorderThickness': 1,
            'hideBulletsCount': 30,
            'title': 'Lows',
            'valueField': 'low',
    		    'fillAlphas': 0
        }],
        'chartCursor': {
            'cursorPosition': 'mouse'
        },
        'categoryField': 'day',
        'categoryAxis': {
            'axisColor': '#DADADA',
            'minorGridEnabled': true
        }
    });
  }

})();
