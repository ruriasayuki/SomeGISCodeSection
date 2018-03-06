(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(require("echarts"));
    else if (typeof define === 'function' && define.amd)
        define(["echarts"], factory);
    else if (typeof exports === 'object')
        exports["bmap"] = factory(require("echarts"));
    else
        root["echarts"] = root["echarts"] || {}, root["echarts"]["bmap"] = factory(root["echarts"]);
    //到这里为止应该只是声明了一个叫bmap的模块
})(this, function (__WEBPACK_EXTERNAL_MODULE_1__) {
    return /******/ (function (modules) { // webpackBootstrap
/******/    // The module cache
/******/    var installedModules = {};

/******/    // The require function
/******/    function __webpack_require__(moduleId) {

/******/        // Check if module is in cache
/******/        if (installedModules[moduleId])
/******/            return installedModules[moduleId].exports;

/******/        // Create a new module (and put it into the cache)
/******/        var module = installedModules[moduleId] = {
/******/            exports: {},
/******/            id: moduleId,
/******/            loaded: false
                /******/
            };

/******/        // Execute the module function
/******/        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/        // Flag the module as loaded
/******/        module.loaded = true;

/******/        // Return the exports of the module
/******/        return module.exports;
            /******/
        }


/******/    // expose the modules object (__webpack_modules__)
/******/    __webpack_require__.m = modules;

/******/    // expose the module cache
/******/    __webpack_require__.c = installedModules;

/******/    // __webpack_public_path__
/******/    __webpack_require__.p = "";

/******/    // Load entry module and return exports
/******/    return __webpack_require__(0);
        /******/
    })
/************************************************************************/
/******/([
/* 0 */
/***/ function (module, exports, __webpack_require__) {

                var __WEBPACK_AMD_DEFINE_RESULT__;/**
     * BMap component extension
     */
                !(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

                    __webpack_require__(1).registerCoordinateSystem(//这里应该是注册了一个叫做bmap的坐标系统，都不用改，关键是要找到注入BMap组件的地方。
                        'bmap', __webpack_require__(2)
                    );
                    __webpack_require__(3);
                    __webpack_require__(4);

                    // Action 看这个注释是注册了这个模块的一些操作？Roam和update = = 
                    __webpack_require__(1).registerAction({
                        type: 'bmapRoam',
                        event: 'bmapRoam',
                        update: 'updateLayout'
                    }, function (payload, ecModel) {
                        ecModel.eachComponent('bmap', function (bMapModel) {
                            var bmap = bMapModel.getBMap();
                            //这里面也区分了 bMapModel就是我们这边内建的模块 而BMap 通过函数getBMap调用出来 也就是说
                            //我们这里要想办法让这个得到的bmap是openlayers，然后后面就是这样子了 = = 
                            var center = bmap.getView().getCenter();
                            bMapModel.setCenterAndZoom([center[0], center[1]], bmap.getView().getZoom());
                        });
                    });

                    return {
                        version: '1.0.0'
                    };
                }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

                /***/
            },
/* 1 */
/***/ function (module, exports) {

                module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

                /***/
            },
/* 2 */
/***/ function (module, exports, __webpack_require__) {

                var __WEBPACK_AMD_DEFINE_RESULT__; !(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

                    var echarts = __webpack_require__(1);
                    var zrUtil = echarts.util;
                    //这个函数又是在哪里调用的呢 = = 这里通过引入BMap和其API 完成了内部模块对百度地图的引用的设定 
                    function BMapCoordSys(bmap, api) {
                        this._bmap = bmap;
                        this.dimensions = ['lng', 'lat'];
                        this._mapOffset = [0, 0];

                        this._api = api;

                        this._projection = new BMap.MercatorProjection();
                    }

                    BMapCoordSys.prototype.dimensions = ['lng', 'lat'];

                    BMapCoordSys.prototype.setZoom = function (zoom) {
                        this._zoom = zoom;
                    };

                    BMapCoordSys.prototype.setCenter = function (center) {
                        this._center = this._projection.lngLatToPoint(new BMap.Point(center[0], center[1]));
                    };

                    BMapCoordSys.prototype.setMapOffset = function (mapOffset) {
                        this._mapOffset = mapOffset;
                    };

                    BMapCoordSys.prototype.getBMap = function () {
                        return this._bmap;
                    };

                    BMapCoordSys.prototype.dataToPoint = function (data) {
                        function mercator(x, y) {
                            var ty = Math.log(Math.tan((90+y)*Math.PI/360))/(Math.PI/180)*20037508.34/180
                            if(y<0) ty=-ty;
  return [x*20037508.34/180, ty];
}
                        //TODO mercator projection is toooooooo slow
                        var mP = mercator(data[0],data[1]);

                        var width = this._api.getZr().getWidth();
                        var height = this._api.getZr().getHeight();
                        var divider = Math.pow(2, 18 - this._zoom);
                        return [
                            Math.round((mP[0] - this._center.x) / divider + width / 2),
                            Math.round((this._center.y - mP[1]) / divider + height / 2)
                        ];
                        // var bmap  = this._bmap;
                        // var ans = bmap.getPixelFromCoordinate([data[0],data[1]]);


                        // var mapOffset = this._mapOffset;
                        // if(ans)
                        // return [ans[0] - mapOffset[0], ans[1] - mapOffset[1]];
                        // else
                        // return [data[0],data[1]];
                    };

                    BMapCoordSys.prototype.pointToData = function (pt) {
                        var mapOffset = this._mapOffset;
                        var pt = this._bmap.overlayPixelToPoint({
                            x: pt[0] + mapOffset[0],
                            y: pt[1] + mapOffset[1]
                        });
                        return [pt.lng, pt.lat];
                    };

                    BMapCoordSys.prototype.getViewRect = function () {
                        var api = this._api;
                        return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight());
                    };

                    BMapCoordSys.prototype.getRoamTransform = function () {
                        return echarts.matrix.create();
                    };

                    BMapCoordSys.prototype.prepareCustoms = function (data) {
                        var rect = this.getViewRect();
                        return {
                            coordSys: {
                                // The name exposed to user is always 'cartesian2d' but not 'grid'.
                                type: 'bmap',
                                x: rect.x,
                                y: rect.y,
                                width: rect.width,
                                height: rect.height
                            },
                            api: {
                                coord: zrUtil.bind(this.dataToPoint, this),
                                size: zrUtil.bind(dataToCoordSize, this)
                            }
                        };
                    };

                    function dataToCoordSize(dataSize, dataItem) {
                        dataItem = dataItem || [0, 0];
                        return zrUtil.map([0, 1], function (dimIdx) {
                            var val = dataItem[dimIdx];
                            var halfSize = dataSize[dimIdx] / 2;
                            var p1 = [];
                            var p2 = [];
                            p1[dimIdx] = val - halfSize;
                            p2[dimIdx] = val + halfSize;
                            p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
                            return Math.abs(this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]);
                        }, this);
                    }

                    var Overlay;

                    // For deciding which dimensions to use when creating list data
                    BMapCoordSys.dimensions = BMapCoordSys.prototype.dimensions;

                    function createOverlayCtor() {
                        function Overlay(root) {
                            this._root = root;
                        }

                        //这里开始 定义Overlay 而这个Overlay正是BMap.Overlay
                        Overlay.prototype = new ol.Overlay({ element: this._root });
                        /**
                         * 鍒濆鍖�
                         *
                         * @param {io.Map} map （这个写法是啥？）
                         * 
                         
                        Overlay.prototype.initialize = function (map) {
                            map.getPanes().labelPane.appendChild(this._root);
                            return this._root;
                        };
                        /**
                         * 
                         
                        Overlay.prototype.draw = function () { };
                        */
                        return Overlay;
                    }
                    //这里传入的是ecModel？ 这个是啥？api 应该是echarts的api吧 所以我改到现在也没有在这个上面报错
                    BMapCoordSys.create = function (ecModel, api) {
                        var bmapCoordSys;
                        var root = api.getDom();

                        // TODO Dispose
                        ecModel.eachComponent('bmap', function (bmapModel) {
                            var viewportRoot = api.getZr().painter.getViewportRoot();
                            if (typeof ol === 'undefined') {//如果不存在BMap组件
                                throw new Error('OpenLayers api is not loaded');
                            }
                            Overlay = Overlay || createOverlayCtor();
                            if (bmapCoordSys) {//如果bmapCoordSys已经定义好了……
                                throw new Error('Only one bmap component can exist');
                            }
                            if (!bmapModel.__bmap) {//所以这下面的代码就是入口
                                // Not support IE8
                                var bmapRoot = root.querySelector('.ec-extension-bmap');
                                if (bmapRoot) {
                                    // Reset viewport left and top, which will be changed
                                    // in moving handler in BMapView
                                    viewportRoot.style.left = '0px';
                                    viewportRoot.style.top = '0px';
                                    root.removeChild(bmapRoot);
                                }
                                bmapRoot = document.createElement('div');
                                bmapRoot.style.cssText = 'width:100%;height:100%';
                                // Not support IE8
                                bmapRoot.classList.add('ec-extension-bmap');
                                root.appendChild(bmapRoot);
                                //所以关键就在这里！！
                                var bmap = bmapModel.__bmap = new ol.Map({
                                    view: new ol.View({
                                        center: [0, 0],
                                        zoom: 1
                                    }),
                                    layers: [
                                        new ol.layer.Tile({
                                            source: new ol.source.OSM()
                                        })
                                    ],
                                    target: bmapRoot
                                });
                                var overlay = new ol.Overlay({ element: viewportRoot, position: [100, 50], stopEvent: false });
                                //emmm 这里说到底 overlay才是容器？ 为什么要添加这个overlayer？
                                bmap.addOverlay(overlay);
                            }
                            var bmap = bmapModel.__bmap;

                            // Set bmap options
                            // centerAndZoom before layout and render
                            var center = bmapModel.get('center');
                            var zoom = bmapModel.get('zoom');
                            if (center && zoom) {
                                var view = new ol.View({ center: center, zoom: zoom, projection: "EPSG:4326" });
                                bmap.setView(view);
                            }

                            bmapCoordSys = new BMapCoordSys(bmap, api);
                            bmapCoordSys.setMapOffset(bmapModel.__mapOffset || [0, 0]);
                            bmapCoordSys.setZoom(zoom);
                            bmapCoordSys.setCenter(center);

                            bmapModel.coordinateSystem = bmapCoordSys;
                        });

                        ecModel.eachSeries(function (seriesModel) {
                            if (seriesModel.get('coordinateSystem') === 'bmap') {
                                seriesModel.coordinateSystem = bmapCoordSys;
                            }
                        });
                    };

                    return BMapCoordSys;
                }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

                /***/
            },
/* 3 */
/***/ function (module, exports, __webpack_require__) {

                var __WEBPACK_AMD_DEFINE_RESULT__; !(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

                    function v2Equal(a, b) {
                        return a && b && a[0] === b[0] && a[1] === b[1];
                    }

                    return __webpack_require__(1).extendComponentModel({
                        type: 'bmap',

                        getBMap: function () {
                            // __bmap is injected when creating BMapCoordSys
                            return this.__bmap;
                        },

                        setCenterAndZoom: function (center, zoom) {
                            this.option.center = center;
                            this.option.zoom = zoom;
                        },

                        centerOrZoomChanged: function (center, zoom) {
                            var option = this.option;
                            return !(v2Equal(center, option.center) && zoom === option.zoom);
                        },

                        defaultOption: {

                            center: [104.114129, 37.550339],

                            zoom: 5,

                            mapStyle: {},

                            roam: false
                        }
                    });
                }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

                /***/
            },
/* 4 */
/***/ function (module, exports, __webpack_require__) {

                var __WEBPACK_AMD_DEFINE_RESULT__; !(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

                    return __webpack_require__(1).extendComponentView({
                        type: 'bmap',

                        render: function (bMapModel, ecModel, api) {
                            var rendering = true;

                            var bmap = bMapModel.getBMap();
                            var viewportRoot = api.getZr().painter.getViewportRoot();
                            var coordSys = bMapModel.coordinateSystem;
                            var moveHandler = function (type, target) {
                                if (rendering) {
                                    return;
                                }
                                var offsetEl = viewportRoot.parentNode.parentNode.parentNode;
                                var mapOffset = [
                                    -parseInt(offsetEl.style.left, 10) || 0,
                                    -parseInt(offsetEl.style.top, 10) || 0
                                ];
                                viewportRoot.style.left = mapOffset[0] + 'px';
                                viewportRoot.style.top = mapOffset[1] + 'px';

                                coordSys.setMapOffset(mapOffset);
                                bMapModel.__mapOffset = mapOffset;

                                api.dispatchAction({
                                    type: 'bmapRoam'
                                });
                            };

                            function zoomEndHandler() {
                                if (rendering) {
                                    return;
                                }
                                api.dispatchAction({
                                    type: 'bmapRoam'
                                });
                            }
                            //这里开始就需要把这些事件监听都给换掉……
                            // bmap.removeEventListener('moving', this._oldMoveHandler);
                            // // FIXME
                            // // Moveend may be triggered by centerAndZoom method when creating coordSys next time
                            // // bmap.removeEventListener('moveend', this._oldMoveHandler);
                            // bmap.removeEventListener('zoomend', this._oldZoomEndHandler);

                            bmap.on("change:view", moveHandler)
                            this._oldMoveHandler = moveHandler;
                            // this._oldZoomEndHandler = zoomEndHandler;

                            var roam = bMapModel.get('roam');
                            //这里是拖动的禁用和启用……
                            if (roam && roam !== 'scale') {
                                //bmap.enableDragging();
                            }
                            else {
                                //bmap.disableDragging();
                            }
                            if (roam && roam !== 'move') {
                                //bmap.enableScrollWheelZoom();
                                //bmap.enableDoubleClickZoom();
                                //bmap.enablePinchToZoom();
                            }
                            else {
                                //bmap.disableScrollWheelZoom();
                                //bmap.disableDoubleClickZoom();
                                //bmap.disablePinchToZoom();
                            }

                            var originalStyle = bMapModel.__mapStyle;

                            var newMapStyle = bMapModel.get('mapStyle') || {};
                            // FIXME, Not use JSON methods
                            var mapStyleStr = JSON.stringify(newMapStyle);
                            if (JSON.stringify(originalStyle) !== mapStyleStr) {
                                // FIXME May have blank tile when dragging if setMapStyle
                                if (Object.keys(newMapStyle).length) {
                                    //openlayers的一些样式设定可以放在这里
                                    //bmap.setMapStyle(newMapStyle);
                                }
                                bMapModel.__mapStyle = JSON.parse(mapStyleStr);
                            }

                            rendering = false;
                        }
                    });
                }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

                /***/
            }
/******/])
});
;