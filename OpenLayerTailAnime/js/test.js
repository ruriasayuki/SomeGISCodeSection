var testList=[[
    {
        lng:110,
        lat:30,
        time:760,
        next:1
    },
    {
        lng:130,
        lat:35,
        time:760.4,
        next:2
    },
    {
        lng:120,
        lat:30,
        time:761,
        next:3
    },
    {
        lng:115,
        lat:39,
        time:761.7,
        next:4
    },
    {
        lng:110,
        lat:40,
        time:762,
        next:0
    }
],
[
    {
        lng:100,
        lat:35,
        time:761,
        next:1
    },
    {
        lng:120,
        lat:35,
        time:761.4,
        next:2
    },
    {
        lng:121,
        lat:33,
        time:761.9,
        next:3
    },
    {
        lng:112,
        lat:39,
        time:762.4,
        next:4
    },
    {
        lng:116,
        lat:42,
        time:763,
        next:0
    }
],
[
    {
        lng:135,
        lat:24,
        time:760.5,
        next:1
    },
    {
        lng:133,
        lat:30,
        time:761.1,
        next:2
    },
    {
        lng:121,
        lat:33,
        time:761.3,
        next:3
    },
    {
        lng:122,
        lat:29,
        time:761.8,
        next:4
    },
    {
        lng:115,
        lat:41,
        time:762.5,
        next:0
    }
]
]
var testGroup = [
{
    marker:null,
    line:null,
    linePoints:new Array(),
    nowPos:null,
    nextPos:null,
    dx:0,
    dy:0,
    newx:0,
    newy:0,
    newc:0,
    hasStart:false
},
{
    marker:null,
    line:null,
    linePoints:new Array(),
    nowPos:null,
    nextPos:null,
    dx:0,
    dy:0,
    newx:0,
    newy:0,
    newc:0,
    hasStart:false
},
{
    marker:null,
    line:null,
    linePoints:new Array(),
    nowPos:null,
    nextPos:null,
    dx:0,
    dy:0,
    newx:0,
    newy:0,
    newc:0,
    hasStart:false
}
]
var styles = {
    'route': new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 6, color: [237, 212, 0, 0.8]
      })
    }),
    'icon': new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/v4.6.4/examples/data/icon.png'
      })
    }),
    'geoMarker': new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        snapToPixel: false,
        fill: new ol.style.Fill({color: 'black'}),
        stroke: new ol.style.Stroke({
          color: 'white', width: 2
        })
      })
    })
  };
var mybmap;
$(document).ready( function (){
    mybmap = new ol.Map({
   layers: [
     new ol.layer.Tile({
       source: new ol.source.Stamen({
         layer: 'watercolor'
       })
     })
   ],
   target: 'map',
   view: new ol.View({
     projection: 'EPSG:4326',
     center: [120, 38],
     zoom: 4
   })
 });}
);

//重构之后的结构
//其实轨迹图按理说是点要素的扩展 而非线要素。。。
var time,overtime;
function start()
{
	//轨迹图动画入口，要做一些动画的相关变量的初始化工作
	for(var i=0;i<testList.length;i++)
	{
		testGroup[i].nowPos=testList[i][0];
	}
	time = 760;//伪代码 mintime表示点要素列表里面时间的最小值
	overtime = 763;//伪代码+1 表示点要素列表里面的时间的最大值
	timestart();//然后开始计时
}
function timestart()
{
	updatePos();
	//这里就只改变时间 然后设定一个延迟
	time = time+0.001;//精度还可以更高，这个参数和下面的时间回调频率会影响动画的精度
	if(time<overtime) setTimeout("timestart()",10);
}
function timestop()//停止计时器
{
}
function timereset()//重设计时器以及所有动画相关变量
{
}
function updatePos()
{
	for(var i=0;i<testList.length;i++)
	{
		var PointList = testList[i];
		var ValueList = testGroup[i];
		if(ValueList.hasStart)
		{
			if(time>ValueList.nextPos.time)
			{
				if(ValueList.nextPos.next!=0)
				{
					testGroup[i].nowPos = ValueList.nextPos;
					testGroup[i].nextPos = PointList[ValueList.nextPos.next];
					testGroup[i].marker.setCoordinates([testGroup[i].nowPos.lng,testGroup[i].nowPos.lat]);
					testGroup[i].linePoints.push([ValueList.nowPos.lng,ValueList.nowPos.lat]);
					testGroup[i].line.setCoordinates(testGroup[i].linePoints);
				}
			}
			else 
			{
				var x1,x2,y1,y2,t1,t2;
				x1 = testGroup[i].nowPos.lng;
				y1 = testGroup[i].nowPos.lat;
				t1 = testGroup[i].nowPos.time;
				x2 = testGroup[i].nextPos.lng;
				y2 = testGroup[i].nextPos.lat;
				t2 = testGroup[i].nextPos.time;
				var nx,ny;
				nx = (x2-x1)*(time-t1)/(t2-t1)+x1;
				ny = (y2-y1)*(time-t1)/(t2-t1)+y1;
				testGroup[i].marker.setCoordinates([nx,ny]);
				testGroup[i].linePoints.splice(-1,1,[nx,ny]);
				testGroup[i].line.setCoordinates(testGroup[i].linePoints);
			}
		}
		else if(ValueList.nowPos.time<time)
		{

			testGroup[i].marker = new ol.geom.Point([ValueList.nowPos.lng,ValueList.nowPos.lat])

			testGroup[i].linePoints.push([ValueList.nowPos.lng,ValueList.nowPos.lat]);
			testGroup[i].linePoints.push([ValueList.nowPos.lng,ValueList.nowPos.lat]);
            testGroup[i].line = new ol.geom.LineString(testGroup[i].linePoints);
            var routeFeature = new ol.Feature({
                type: 'route',
                geometry: testGroup[i].line 
              });
              var geoMarker = new ol.Feature({
                type: 'geoMarker',
                geometry: testGroup[i].marker
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
			testGroup[i].hasStart = true;
			testGroup[i].nextPos = PointList[ValueList.nowPos.next];
		}
	}
}
  