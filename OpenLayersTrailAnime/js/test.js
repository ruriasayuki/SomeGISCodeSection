
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
    layer.setStyle({lineColor:[100,100,200,0.5],lineWidth:10,markerColor:[200,200,100,0.5],markerWidth:10});
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