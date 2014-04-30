(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    initMap(40, -95, 4);
    $('#add').click(add);
  }
  function add() {
    addToMap();
    addWeatherGraph();
  }
  function addWeatherGraph() {
    var location = $('#location').val();
    var url = 'http://api.wunderground.com/api/80d7e4749cbf760e/forecast10day/q/' + location + '.json?callback=?';
    $.getJSON(url, getWeather);
  }
  function getWeather(data) {
    var zip = $('#location').val();
    $('#graphs').append('<div class=graph data-zip=' + zip + '></div>');
    makeChart(zip);
    {
      try {
        throw undefined;
      } catch ($i) {
        $i = 0;
        for (; $i < 10; $i++) {
          try {
            throw undefined;
          } catch (i) {
            i = $i;
            try {
              try {
                throw undefined;
              } catch (day) {
                try {
                  throw undefined;
                } catch (low) {
                  try {
                    throw undefined;
                  } catch (high) {
                    high = data.forecast.simpleforecast.forecastday[$traceurRuntime.toProperty(i)].high.fahrenheit;
                    low = data.forecast.simpleforecast.forecastday[$traceurRuntime.toProperty(i)].low.fahrenheit;
                    day = data.forecast.simpleforecast.forecastday[$traceurRuntime.toProperty(i)].date.weekday;
                    chart[$traceurRuntime.toProperty(zip)].dataProvider.push({
                      day: day,
                      high: high,
                      low: low
                    });
                  }
                }
              }
            } finally {
              $i = i;
            }
          }
        }
      }
    }
    chart[$traceurRuntime.toProperty(zip)].validateData();
  }
  function addToMap() {
    var location = $('#location').val();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: location}, (function(results, status) {
      var name = results[0].formatted_address;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name);
    }));
  }
  function addMarker(lat, lng, name) {
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      map: map,
      position: latLng,
      title: name
    });
  }
  var map;
  function initMap(lat, lng, zoom) {
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
  var chart = {};
  function makeChart(zip) {
    var graph = $('.graph[data-zip=' + zip + ']')[0];
    $traceurRuntime.setProperty(chart, zip, AmCharts.makeChart(graph, {
      'type': 'serial',
      'theme': 'dark',
      'titles': [{
        'text': zip,
        'size': 15
      }],
      'pathToImages': 'http://www.amcharts.com/lib/3/images/',
      'legend': {'useGraphSettings': true},
      'dataProvider': [],
      'valueAxes': [{
        'id': 'v1',
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
      'chartCursor': {'cursorPosition': 'mouse'},
      'categoryField': 'day',
      'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true
      }
    }));
  }
})();

//# sourceMappingURL=main.map
