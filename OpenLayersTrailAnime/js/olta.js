//olta is openlayers' trail animation
var oltaKeyNode = function(lng,lat,time,next,label){
    this.lng = lng||0;
    this.lat = lat||0;
    this.time = time||null;
    this.next = next||0;
    this.label = label||"";
}

var oltaLayer = function(name){
    this.name = name||'';
    this.keyNodes = new Array();
    this.marker = null;
    this.markerStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          snapToPixel: false,
          fill: new ol.style.Fill({color: 'black'}),
          stroke: new ol.style.Stroke({
            color: 'white', width: 2
          })})});
    this.line = null;
    this.lineStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 6, color: [237, 212, 0, 0.5]
        })
      });
    this.linePoints = new Array();
    this.nowPos = null;
    this.nextPos = null;
    this.dx = 0;
    this.dy = 0 ;
    this.newx = 0;
    this.newy = 0;        
    this.newc = 0;
    this.hasStart = false;
    this.notEnd = false;
    this.minTime = null;
    this.maxTime = null;
    this.vectorLayer = null;
    this.popup = null;
}

var oltaMana = function(name){
    this.name = name;
    this.layers =new Array();
    this.animate = false;
    this.time =-1;
    this.minTime = null;
    this.maxTime = null;
    this.layerNum = 0;
}

oltaLayer.prototype.addNode = function(node){
    let nodesNum = this.keyNodes.length;
    if(nodesNum == 0){
        this.keyNodes.push(node);
        this.minTime = node.time;
        this.maxTime = node.time;
    }
    else{
        this.keyNodes.push(node);
        this.minTime = (node.time<this.minTime)?node.time:this.minTime;
        this.maxTime = (node.time>this.maxTime)?node.time:this.maxTime;
    }
}

oltaLayer.prototype.setStyle = function(styleJson){
    this.lineStyle =  new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: styleJson.lineWidth, color: styleJson.lineColor
        })
      });
    this.markerStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: styleJson.markerWidth,
          snapToPixel: false,
          fill: new ol.style.Fill({color: styleJson.markerColor}),
          stroke: new ol.style.Stroke({
            color: 'white', width: 2
          })})});
}


oltaMana.prototype.addLayer = function (layer){
    if(this.layerNum==0){
        this.layers.push(layer);
        this.minTime = layer.minTime;
        this.maxTime = layer.maxTime;
        this.layerNum++;
    }
    else{
        this.layers.push(layer);
        this.minTime = (layer.minTime<this.minTime)?layer.minTime:this.minTime;
        this.maxTime = (layer.maxTime>this.maxTime)?layer.maxTime:this.maxTime;
        this.layerNum++;
    }
}

oltaMana.prototype.initAnime = function(){
    for(let i = 0;i<this.layerNum;i++){
        this.layers[i].nowPos = this.layers[i].keyNodes[0];
        this.layers[i].hasStart = false;
        this.layers[i].notEnd = true;
    }
    this.time = this.minTime;
    this.animate = true;
}

oltaMana.prototype.startAnime = function(){
	this.updatePos();
	//这里就只改变时间 然后设定一个延迟
	this.time = this.time+0.001;//精度还可以更高，这个参数和下面的时间回调频率会影响动画的精度
	if(this.animate) setTimeout(this.name+".startAnime()",10);
}

oltaMana.prototype.updatePos = function(){
    for(let i = 0; i<this.layerNum;i++)
	{
		let nowLayer = this.layers[i];
		if(nowLayer.hasStart&&nowLayer.notEnd)
		{
			if(this.time>nowLayer.nextPos.time)
			{
					nowLayer.nowPos = nowLayer.nextPos;
					nowLayer.nextPos = nowLayer.keyNodes[nowLayer.nextPos.next];
					nowLayer.marker.setCoordinates([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
					nowLayer.linePoints.push([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
                    nowLayer.line.setCoordinates(nowLayer.linePoints);
                    $(nowLayer.popup.getElement()).find("#popup-content").html(nowLayer.nowPos.label);
                    nowLayer.popup.setPosition([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
                    if(nowLayer.nowPos.next==0) {
                        nowLayer.notEnd=false;
                        this.updateAnimeState();
                    }
			}
			else 
			{
				var x1,x2,y1,y2,t1,t2;
				x1 = nowLayer.nowPos.lng;
				y1 = nowLayer.nowPos.lat;
				t1 = nowLayer.nowPos.time;
				x2 = nowLayer.nextPos.lng;
				y2 = nowLayer.nextPos.lat;
				t2 = nowLayer.nextPos.time;
				var nx,ny;
				nx = (x2-x1)*(this.time-t1)/(t2-t1)+x1;
				ny = (y2-y1)*(this.time-t1)/(t2-t1)+y1;
				nowLayer.marker.setCoordinates([nx,ny]);
				nowLayer.linePoints.splice(-1,1,[nx,ny]);
				nowLayer.line.setCoordinates(nowLayer.linePoints);
			}
		}
		else if(nowLayer.nowPos.time<this.time&&nowLayer.notEnd)
		{

			nowLayer.marker = new ol.geom.Point([nowLayer.nowPos.lng,nowLayer.nowPos.lat])

			nowLayer.linePoints.push([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
			nowLayer.linePoints.push([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
            nowLayer.line = new ol.geom.LineString(nowLayer.linePoints);
            var routeFeature = new ol.Feature({
                geometry: nowLayer.line
              });
              routeFeature.setStyle(nowLayer.lineStyle);
            var geoMarker = new ol.Feature({
                geometry: nowLayer.marker
              });
              geoMarker.setStyle(nowLayer.markerStyle);
            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                  features: [routeFeature,geoMarker]
                }),
                style: function(feature) {
                    return feature.getStyle();
                }
            }); 
              //insert an popup 
              var tDiv = document.createElement('div');
              tDiv.innerHTML = '<div id="'+nowLayer.name+'popup" class="ol-popup">'+
              '<a href="#" id="popup-closer" class="ol-popup-closer"></a>'+
              '<div id="popup-content"></div>'+
              '</div>';
              document.body.appendChild(tDiv);
              var overlay = new ol.Overlay({
                element: tDiv ,
                autoPan: true,
                autoPanAnimation: {
                  duration: 250
                }
              });
              $(overlay.getElement()).find("#popup-content").html(nowLayer.nowPos.label);
              
              nowLayer.popup = overlay;
            overlay.setPosition([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
            mybmap.addOverlay(overlay);
			mybmap.addLayer(vectorLayer);
            nowLayer.hasStart = true;
            nowLayer.vectorLayer = vectorLayer;
			nowLayer.nextPos = nowLayer.keyNodes[nowLayer.nowPos.next];
		}
	}
}
oltaMana.prototype.updateAnimeState = function(){
    let animate = false;
    for(let i = 0; i < this.layerNum; i ++ ){
        animate = animate || this.layers[i].notEnd;
        if (animate) break;
    }
    this.animate = animation;
}
oltaMana.prototype.stopAnime = function(){
    this.animate = false;
}
oltaMana.prototype.restartAnime = function(){
    this.animate = true;
    this.startAnime();
}