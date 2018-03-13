$(document).ready(
    function(){
         var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.Stamen({
              layer: 'watercolor'
            })
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.fromLonLat([120, 38]),
          zoom: 4
        })
      });
      
        var dataSet;
      $.ajaxSettings.async = false;
		$.getJSON("json/new_qing_prov.json", function (geojson) {//demo的geojson还是写死的

            dataSet = geojson;
            for(var i=0;i<dataSet.features.length;i++)
                {
                    dataSet.features.id = dataSet.features.gid; 
                }
        });
		$.ajaxSettings.async = true;
      olvLayer = new OlvLayer(map,dataSet,"","");
    });