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
var layer;
var layerMana;
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
 });
    layerMana = new oltaMana("layerMana");
    layer = new oltaLayer("layer1");
    layer.addNode(new oltaKeyNode(120,30,1,1,"李白测试1"));
    layer.addNode(new oltaKeyNode(120,31,2,2,"李白在这里写下了一首诗"));
    layer.addNode(new oltaKeyNode(120,32,3,3,"李白被贬"));
    layer.addNode(new oltaKeyNode(121,34,4,0,"李白回到原来的地方"));
    layer2 = new oltaLayer("layer2");
    layer2.addNode(new oltaKeyNode(121,29,2,1,"杜甫测试"));
    layer2.addNode(new oltaKeyNode(121,31,3,2,"杜甫看了李白写的诗，也写了一首诗"));
    layer2.addNode(new oltaKeyNode(121,32,4,3,"杜甫跟着李白被贬"));
    layer2.addNode(new oltaKeyNode(122,34,5,0,"杜甫回到了出生的地方"));
    layerMana.addLayer(layer);
    layerMana.addLayer(layer2);
    }
);

//重构之后的结构
//其实轨迹图按理说是点要素的扩展 而非线要素。。。
var time,overtime;
function start()
{
    layerMana.initAnime ();
	layerMana.startAnime();//然后开始计时
}
function space()
{
    layerMana.stopAnime ();

}
function restart()
{
	layerMana.restartAnime();//然后开始计时
}