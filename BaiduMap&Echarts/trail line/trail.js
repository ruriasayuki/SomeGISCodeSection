function TrailLayer(jsondata)
{
    /*
    PointList 点序列
    marker:null, marker对象
	line:null, 线对象
	linePoints:new Array(), 线对象用点序列
	nowPos:null, 当前点位置
	nextPos:null,  移动目标坐标点
	hasStart:false  线动画开关
    */
}

function TrailMana()
{
    /*
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
					testGroup[i].marker.setPosition(new BMap.Point(testGroup[i].nowPos.lng,testGroup[i].nowPos.lat));
					testGroup[i].linePoints.push(new BMap.Point(ValueList.nowPos.lng,ValueList.nowPos.lat));
					testGroup[i].line.setPath(testGroup[i].linePoints);
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
				testGroup[i].marker.setPosition(new BMap.Point(nx,ny));
				testGroup[i].linePoints.splice(-1,1,new BMap.Point(nx,ny));
				testGroup[i].line.setPath(testGroup[i].linePoints);
			}
		}
		else if(ValueList.nowPos.time<time)
		{
			testGroup[i].marker = new BMap.Marker(new BMap.Point(ValueList.nowPos.lng,ValueList.nowPos.lat),
			{
				offset:new BMap.Size(0,0),
				icon:new BMap.Icon('../img/libai.jpg',new BMap.Size(50,50))
			});
			testGroup[i].linePoints.push(new BMap.Point(ValueList.nowPos.lng,ValueList.nowPos.lat));
			testGroup[i].linePoints.push(new BMap.Point(ValueList.nowPos.lng,ValueList.nowPos.lat));
			testGroup[i].line = new BMap.Polyline(testGroup[i].linePoints);
			mybmap.addOverlay(testGroup[i].marker);
			mybmap.addOverlay(testGroup[i].line);
			testGroup[i].hasStart = true;
			testGroup[i].nextPos = PointList[ValueList.nowPos.next];
		}
	}
}
    */
}