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
    // this.mapInit()
    this.mymap = new AMap.Map('container', {
      center: [121.446147, 31.236253],
      resizeEnable: true,
      zoom: 10
    })
    // 绑定地图移动与缩放事件
    this.mymap.on('moveend', this.logMapinfo)
    this.mymap.on('zoomend', this.logMapinfo)
    // 点击获取当前的坐标系
    // 为地图注册click事件获取鼠标点击出的经纬度坐标
    this.mymap.on('click', (e) => {
      this.CoordinateSystem = e.lnglat.getLng() + ',' + e.lnglat.getLat()
    })
  },
  methods: {
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
