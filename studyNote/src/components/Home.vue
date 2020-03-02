<template>
  <div class="home">
    <div id="container"></div>
    <div class="mapInfo">
      <h4>获取地图级别与中心点坐标</h4>
      <p>当前级别: {{ mapLevel }}</p>
      <p>当前中心点: {{ mapCore }}</p>
    </div>
  </div>
</template>

<script>
window.onLoad = function () {
  var map = new AMap.Map('container', {
    resizeEnable: true, // 是否监控地图容器尺寸变化
    zoom: 11, // 初始地图级别
    center: [121.498586, 31.239637] // 初始地图中心点
  })
}
var url =
  'https://webapi.amap.com/maps?v=1.4.15&key=5b174ba38c1d1acf0fb43dc22e0528eb&callback=onLoad'
var jsapi = document.createElement('script')
jsapi.charset = 'utf-8'
jsapi.src = url
document.head.appendChild(jsapi)

export default {
  data () {
    return {
      mapLevel: '',
      mapCore: ''
    }
  },
  mounted () {
    // map.on('complete', function () {
    //   log.success('地图加载完成！')
    // })
  },
  methods: {}
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
  .mapInfo{
    position: absolute;
    top: 0;
    right: 10px;
    width: 200px;
    padding: 10px;
    background: #999
  }
}
</style>
