<template>
  <div class="home">
    <div id="container"></div>
    <div class="mapInfo">
      <h4>获取地图级别与中心点坐标</h4>
      <p>当前级别: {{ mapLevel }}</p>
      <p>当前中心点: {{ mapCore }}</p>
      <p>点击获取当前的坐标系: {{ CoordinateSystem }}</p>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap'
export default {
  data () {
    return {
      // 声明全局的map重新赋值的
      mymap: null,
      // 当前级别
      mapLevel: '',
      // 当前中心点
      mapCore: '',
      // 点击获取当前的坐标系
      CoordinateSystem: ''
    }
  },
  mounted () {
    // 地图初始化
    this.mapInit()

    // 绑定地图移动与缩放事件
    this.mymap.on('moveend', this.logMapinfo)
    this.mymap.on('zoomend', this.logMapinfo)
    // 点击获取当前的坐标系
    // 为地图注册click事件获取鼠标点击出的经纬度坐标
    this.mymap.on('click', e => {
      this.CoordinateSystem = e.lnglat.getLng() + ',' + e.lnglat.getLat()
    })
    // 添加地图标点
    let markerSH = new AMap.Marker({
      position: new AMap.LngLat(121.469002, 31.226367), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: '上海'
    })
    let markerBJ = new AMap.Marker({
      position: new AMap.LngLat(116.419298, 39.8916), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: '北京'
    })
    let markerNJ = new AMap.Marker({
      position: new AMap.LngLat(118.797951, 32.045974), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: '南京'
    })
    let markerFN = new AMap.Marker({
      position: new AMap.LngLat(119.552726, 33.613104), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: '王新星老窝'
    })
    let markerList = [ markerSH, markerBJ, markerNJ, markerFN ]
    this.mymap.add(markerList)
  },
  methods: {
    mapInit () {
      (this.mymap = new AMap.Map('container', {
        center: [121.469002, 31.226367],
        resizeEnable: true,
        zoom: 6
        // pitch: 75 // 地图俯仰角度，有效范围 0 度- 83 度
        // viewMode: '3D' // 地图模式
      }))
      // 异步加载多个插件
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation'], () => {
        this.mymap.addControl(new AMap.ToolBar())
        this.mymap.addControl(new AMap.Scale())
        // this.mymap.addControl(new AMap.Geolocation())
        // this.mymap.addControl(new AMap.Weather())
        // this.mymap.addControl(new AMap.ElasticMarker())
        // this.mymap.addControl(new AMap.OverView())
      })
    },
    // 绑定地图移动与缩放事件
    logMapinfo () {
      this.mapLevel = this.mymap.getZoom() // 获取当前地图级别
      this.mapCore = this.mymap.getCenter() // 获取当前地图中心位置
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  position: relative;
  padding: 20px;

  #container {
    width: 100%;
    height: 800px;
  }
  .mapInfo {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 400px;
    padding: 10px;
    background: #999;
  }
}
</style>
