var oltaKeyNode = function(lng,lat,time,next){
    this.lng = lng||0;
    this.lat = lat||0;
    this.time = time||null;
    this.next = next||0;
}

var oltaLayer = function(){
    this.keyNodes = new Array();
    this.marker = null;
    this.line = null;
    this.linePoints = new Array();
    this.nowPos = null;
    this.nextPos = null;
    this.dx = 0;
    this.dy = 0 ;
    this.newx = 0;
    this.newy = 0;        
    this.newc = 0;
    this.hasStart = false;
    this.minTime = null;
    this.maxTime = null;
    this.vectorLayer = null;
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
    }
    this.time = this.minTime;
}

oltaMana.prototype.startAnime = function(){
	this.updatePos();
	//这里就只改变时间 然后设定一个延迟
	this.time = this.time+0.001;//精度还可以更高，这个参数和下面的时间回调频率会影响动画的精度
	if(this.time<this.maxTime) setTimeout(this.name+".startAnime()",10);
}

oltaMana.prototype.updatePos = function(){
    for(let i = 0; i<this.layerNum;i++)
	{
		let nowLayer = this.layers[i];
		if(nowLayer.hasStart)
		{
			if(this.time>nowLayer.nextPos.time)
			{
				if(nowLayer.nextPos.next!=0)
				{
					nowLayer.nowPos = nowLayer.nextPos;
					nowLayer.nextPos = nowLayer.keyNodes[nowLayer.nextPos.next];
					nowLayer.marker.setCoordinates([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
					nowLayer.linePoints.push([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
					nowLayer.line.setCoordinates(nowLayer.linePoints);
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
		else if(nowLayer.nowPos.time<this.time)
		{

			nowLayer.marker = new ol.geom.Point([nowLayer.nowPos.lng,nowLayer.nowPos.lat])

			nowLayer.linePoints.push([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
			nowLayer.linePoints.push([nowLayer.nowPos.lng,nowLayer.nowPos.lat]);
            nowLayer.line = new ol.geom.LineString(nowLayer.linePoints);
            var routeFeature = new ol.Feature({
                type: 'route',
                geometry: nowLayer.line 
              });
              var geoMarker = new ol.Feature({
                type: 'geoMarker',
                geometry: nowLayer.marker
              });
            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                  features: [routeFeature,geoMarker]
                }),
                style: function(feature) {
                  // hide geoMarker if animation is active
                //   if (feature.get('type') === 'geoMarker') {
                //     return null;
                //   }
                  return styles[feature.get('type')];
                }
              });
        
			mybmap.addLayer(vectorLayer);
            nowLayer.hasStart = true;
            nowLayer.vectorLayer = vectorLayer;
			nowLayer.nextPos = nowLayer.keyNodes[nowLayer.nowPos.next];
		}
	}
}