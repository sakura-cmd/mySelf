<template>
  <div class="home">
    <div id="container"></div>
    <div class="mapInfo">
      <h4>获取地图级别与中心点坐标</h4>
      <p>当前所在城市: {{nowCity }}</p>
      <p>当前地图级别: {{ mapLevel }}</p>
      <p>当前地图中心点: {{ mapCore }}</p>
      <p>点击获取当前的坐标系: {{ CoordinateSystem }}</p>
      <P>输入地址定位: <el-input
          type="text"
          id="addLocation"
          v-model="locationInfo"
          @keyup.enter.native="changeLocation(locationInfo)"
          placeholder="输入关键字选取地点"
        ></el-input>
      </P>
      <p></p>
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
      // 当前城市
      nowCity: '',
      // 当前级别
      mapLevel: '',
      // 当前中心点
      mapCore: '',
      // 点击获取当前的坐标系
      CoordinateSystem: '',
      // POI选点在marker弹出来的信息框
      infoWindow: null,
      // POI实例
      poiPicker: null,
      // 输入框的内容实例
      locationInfo: '',
      // POI的marker实例
      marker: ''
    }
  },
  mounted () {
    // 地图初始化
    this.mapInit()
  },
  methods: {
    // 地图初始化
    mapInit () {
      this.mymap = new AMap.Map('container', {
        center: [121.469002, 31.226367],
        resizeEnable: true,
        zoom: 6,
        amap: '//styles/macaron'
        // pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        // viewMode: '3D' // 地图模式
      })
      // 异步加载多个插件
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        //
        this.mymap.addControl(new AMap.ToolBar())
        // 高德自带比例尺
        this.mymap.addControl(new AMap.Scale())
      })
      // 显示地图缩放控件
      AMapUI.loadUI(['control/BasicControl'], BasicControl => {
        // 缩放控件，显示Zoom值
        this.mymap.addControl(
          new BasicControl.Zoom({
            position: 'rb',
            showZoomNum: true
          })
        )
        // 图层切换控件
        this.mymap.addControl(
          new BasicControl.LayerSwitcher({
            position: 'rb'
          })
        )
      })

      // 绑定地图移动与缩放事件
      this.mymap.on('moveend', this.logMapinfo)
      this.mymap.on('zoomend', this.logMapinfo)
      // 点击获取当前的坐标系
      // 为地图注册click事件获取鼠标点击出的经纬度坐标
      this.mymap.on('click', e => {
        this.CoordinateSystem = e.lnglat.getLng() + ',' + e.lnglat.getLat()
        // this.openInfoWin()
      })
      // 添加地图标点
      // let markerSH = new AMap.Marker({
      //   position: new AMap.LngLat(121.469002, 31.226367), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //   title: '上海'
      // })
      // let markerBJ = new AMap.Marker({
      //   position: new AMap.LngLat(116.419298, 39.8916), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //   title: '北京'
      // })
      // let markerNJ = new AMap.Marker({
      //   position: new AMap.LngLat(118.797951, 32.045974), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //   title: '南京'
      // })
      // let markerFN = new AMap.Marker({
      //   iconLabel: 'ahha',
      //   iconStyle: 'green',
      //   map: this.mymap,
      //   position: new AMap.LngLat(119.552726, 33.613104), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      //   title: '王新星老窝'
      // })
      // let markerList = [markerSH, markerBJ, markerNJ, markerFN]
      // this.mymap.add(markerList)
      // this.mymap.add(markerSH)
      // 设置DomLibrary，jQuery或者Zepto
      // AMapUI.setDomLibrary($)
      // 加载SimpleInfoWindow，loadUI的路径参数为模块名中 'ui/' 之后的部分
      // AMapUI.loadUI(['overlay/SimpleInfoWindow'], SimpleInfoWindow => {
      //   this.infoWindow = new SimpleInfoWindow({
      //     infoTitle: '<strong>这里是标题</strong>',
      //     infoBody: '<p>这里是内容。</p>',
      //     // 基点指向marker的头部位置
      //     offset: new AMap.Pixel(0, -31)
      //   })
      //   // marker 点击时打开
      //   AMap.event.addListener(markerSH, 'click', () => {
      //     this.openInfoWin()
      //   })
      // })
      // POI输入框选点
      AMapUI.loadUI(['misc/PoiPicker'], PoiPicker => {
        this.poiPicker = new PoiPicker({
          city: '上海',
          input: 'addLocation'
        })

        // 初始化poiPicker
        this.poiPickerReady(this.poiPicker)
      })
      // 初始化当前位置
      this.showCityInfo()
    },
    // 绑定地图移动与缩放事件
    logMapinfo () {
      this.mapLevel = this.mymap.getZoom() // 获取当前地图级别
      this.mapCore = this.mymap.getCenter() // 获取当前地图中心位置
    },
    // 点击marker打开
    openInfoWin () {
      // 显示在map上
      // this.infoWindow.open(this.mymap, this.mymap.getCenter())
      this.infoWindow.open(this.mymap, this.marker.getPosition())
    },
    // 输入框选址
    changeLocation (val) {
      // this.poiPickerReady(val)
    },
    // 初始化poiPicker
    poiPickerReady (poiPicker) {
      // console.log(poiPicker)
      window.poiPicker = poiPicker
      this.marker = new AMap.Marker()
      this.infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -30)
      })
      AMap.event.addListener(this.marker, 'click', () => {
        this.openInfoWin()
      })
      // 选取了某个POI
      poiPicker.on('poiPicked', poiResult => {
        // console.log(poiResult)
        let source = poiResult.source
        let poi = poiResult.item
        let info = {
          source: source,
          id: poi.id,
          name: poi.name,
          location: poi.location.toString(),
          address: poi.address
        }
        // marker
        this.marker.setMap(this.mymap)
        this.infoWindow.setMap(this.mymap)
        this.marker.setPosition(poi.location)
        this.infoWindow.setPosition(poi.location)
        this.infoWindow.setContent(
          // 'POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>'
          // '地理信息: <pre>' + '<div>' + '搜索名称:' + info.name + '<br>' + '地址:' + info.address + '<br>' + '坐标地址:' + info.location + '<br>' + '</div>' + '</pre>'
          this.createContent(info)
        )
        this.openInfoWin()
        this.CoordinateSystem = info.location
        this.locationInfo = info.name
        // map.setCenter(marker.getPosition());
      })

      // poiPicker.onCityReady(function () {
      //   poiPicker.suggest('美食')
      // })
    },
    // 动态添加infoWindow里面的信息
    createContent (info) {
      // 信息窗体内容
      var s = []
      s.push('<b>地理信息' + '</b>')
      s.push('搜索名称:' + info.name)
      s.push('地址:' + info.address)
      s.push('坐标地址:' + info.location)
      return s.join('<br>')
    },
    // 获取当前城市
    showCityInfo () {
      // 实例化城市查询类
      let citysearch = new AMap.CitySearch()
      // 自动获取用户IP，返回当前城市
      citysearch.getLocalCity((status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            console.log(result.bounds)
            this.nowCity = result.city
            let citybounds = result.bounds
            // 地图显示当前城市
            this.mymap.setBounds(citybounds)
          }
        } else {
          this.nowCity = result.info
        }
      })
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

    /deep/ .amap-ui-control-theme-light .amap-ui-control-layer {
      margin-right: 44px;
    }
  }
  .mapInfo {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 410px;
    padding: 10px;
    background: #999;

    /deep/ .el-input {
      width: 300px;
      #addLocation {
        padding-left: 8px;
        width: 300px;
        height: 26px;
        line-height: 26px;
      }
    }
  }
}
</style>
