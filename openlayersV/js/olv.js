/**
     * 构造函数
     *
     * @param {String|HTMLElement|ol.Map} obj
     * @param {String} geoJsonUrl
     * @param {Array} dataset
     * @param {option} setting
     * @constructor
     */
function OlvLayer(map,geoJson,data,option){
        this._map = map;
        this.dataSet = this.clone(data); 
        this._geoJson = geoJson;
        this.option = option;
        this._init();    
    }
OlvLayer.prototype._map = null;
OlvLayer.prototype._layer = null;
OlvLayer.prototype._geoJson = null;
/* dataset */
OlvLayer.prototype.dataSet = null;
OlvLayer.prototype.option = null;
OlvLayer.prototype.style =  function(features){
        console.log(features.values_.name);
        return new ol.style.Style({
                fill: new ol.style.Fill({
                  color: 'rgba(255, 255, 255, 0.6)'
                }),
                stroke: new ol.style.Stroke({
                  color: '#319FD3',
                  width: 1
                })
    });
    return stylefuntion;
};
/* clone array a To b */
OlvLayer.prototype.clone = function(a){
    b = new Array();
    for(var i=0;i<a.length;i++)
        {
            b.push(a[i]);
        }
    return b;
}
OlvLayer.prototype._init = function(){
    this._layer = new ol.layer.Image({
            source: new ol.source.ImageVector({
              source: new ol.source.Vector({
                features: this._geoJson.features,
                format: new ol.format.GeoJSON()
              }),
              style: this.style
            }
            )
    });
    
    this._map.addLayer(this._layer);

}
OlvLayer.prototype.hide = function(){

}
OlvLayer.prototype.show = function(){
    
}


