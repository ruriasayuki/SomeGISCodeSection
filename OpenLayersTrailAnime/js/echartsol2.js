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
                    function BMapCoordSys( api) {
                        
                        this.dimensions = ['lng', 'lat'];
                        this._mapOffset = [0, 0];

                        this._api = api;

                    }

                    BMapCoordSys.prototype.dimensions = ['lng', 'lat'];

                    BMapCoordSys.prototype.setZoom = function (zoom) {
                        this._zoom = zoom;
                    };

                    BMapCoordSys.prototype.setCenter = function (center) {
                        this._center = [0,0];
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
                        return [
                            Math.round((mP[0]) / 20037508.34/2*width + width / 2),
                            Math.round((- mP[1]) /  20037508.34/2*height + height / 2)
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
                            
                            bmapCoordSys = new BMapCoordSys( api);
                            bmapCoordSys.setMapOffset(bmapModel.__mapOffset || [0, 0]);
                            bmapCoordSys.setZoom(5);
                            bmapCoordSys.setCenter([0,0]);

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

                            center: [0, 0],

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
                            rendering = false;
                        }
                    });
                }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

                /***/
            }
/******/])
});
;