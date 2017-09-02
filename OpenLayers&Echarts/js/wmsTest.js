$(document).ready(function(){
var wmsSource = new ol.source.ImageWMS({
        url: 'http://worldmap.harvard.edu/geoserver/wms?STYLES=high_speed_rail_lines_2016_40kh_n_8_p_h_o&FORMAT=image%2Fpng&TRANSPARENT=TRUE&LAYERS=geonode%3Ahigh_speed_rail_lines_2016_40k&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetMap&LLBBOX=87.526238058,18.291528586,130.404662152,47.3381965350001&URL=http%3A%2F%2Fworldmap.harvard.edu%2Fgeoserver%2Fwms&TILED=true&SRS=EPSG%3A900913&BBOX=8766409.89875,5009377.085,10018754.17,6261721.35625&WIDTH=256&HEIGHT=256',
        params: {'LAYERS': 'ne:ne'},
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
      });

      var wmsLayer = new ol.layer.Image({
        source: wmsSource
      });

      var view = new ol.View({
        center: [0, 0],
        zoom: 1
      });

      var map = new ol.Map({
        layers: [wmsLayer],
        target: 'map',
        view: view
      });

      map.on('singleclick', function(evt) {
        document.getElementById('info').innerHTML = '';
        var viewResolution = /** @type {number} */ (view.getResolution());
        var url = wmsSource.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, 'EPSG:3857',
            {'INFO_FORMAT': 'text/html'});
        if (url) {
          document.getElementById('info').innerHTML =
              '<iframe seamless src="' + url + '"></iframe>';
        }
      });

      map.on('pointermove', function(evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        var hit = map.forEachLayerAtPixel(pixel, function() {
          return true;
        });
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });
});