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
      <p>省：<select
          id="province"
          style="width: 300px; height: 30px; border: 1px solid #ccc"
          @change="searchArea"
        ></select></p>
      <p>市：<select
          id="city"
          style="width: 300px; height: 30px; border: 1px solid #ccc"
          @change="searchArea"
        ></select></p>
      <p>区：<select
          id="district"
          style="width: 300px; height: 30px; border: 1px solid #ccc"
          @change="searchArea"
        ></select></p>
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
      nowCity: '上海市',
      // 当前级别
      mapLevel: '6',
      // 当前中心点
      mapCore: '121.469002, 31.226367',
      // 点击获取当前的坐标系
      CoordinateSystem: '121.469002, 31.226367',
      // POI选点在marker弹出来的信息框
      infoWindow: null,
      // POI实例
      poiPicker: null,
      // 输入框的内容实例
      locationInfo: null,
      // POI的marker实例
      marker: null,
      // 绘制区域
      polygons: [],
      // 区
      district: null
    }
  },
  mounted () {
    // 地图初始化
    this.mapInit()
    // 行政区查询
    this.province()
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
      AMap.plugin(
        ['AMap.ToolBar', 'AMap.Scale', 'AMap.Geocoder', 'AMap.DistrictSearch'],
        () => {
          // 放大尺
          this.mymap.addControl(new AMap.ToolBar())
          // 高德自带比例尺
          this.mymap.addControl(new AMap.Scale())
        }
      )
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
      // 移动地图获取当前城市位置
      this.mymap.on('moveend', this.showCityInfo)
      // 为地图注册click事件获取鼠标点击出的经纬度坐标
      this.mymap.on('click', e => {
        this.CoordinateSystem = e.lnglat.getLng() + ',' + e.lnglat.getLat()
        // this.openInfoWin()
        this.showAddressInfo()
        this.logMapinfo()
        // this.poiPickerReady(this.CoordinateSystem)
      })
      // POI输入框选点
      AMapUI.loadUI(['misc/PoiPicker'], PoiPicker => {
        this.poiPicker = new PoiPicker({
          city: '上海',
          input: 'addLocation'
        })
        // 初始化poiPicker
        this.poiPickerReady(this.poiPicker)
      })
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
    // 初始化poiPicker,POI
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
      poiPicker.on('poiPicked', res => {
        console.log(res)
        let source = res.source
        let poi = res.item
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
        this.infoWindow.setContent(this.createContent(info))
        this.openInfoWin()
        this.CoordinateSystem = info.location
        this.locationInfo = info.name
        this.mymap.getCenter()
        this.nowCity = poi.cityname
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
      this.mymap.getCity(info => {
        this.nowCity = info.province + info.city + info.district
      })
    },
    // 逆向地理编码====>根据坐标显示地名
    showAddressInfo () {
      // geocoder反编码
      let geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '上海'
      })
      geocoder.getAddress(this.CoordinateSystem, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          // result为对应的地理位置详细信息
          this.nowCity = result.regeocode.formattedAddress
        } else {
          this.$message.warning('根据经纬度查询地址失败')
        }
      })
    },
    // 行政区划查询
    province () {
      let opts = {
        subdistrict: 1, // 返回下一级行政区
        showbiz: false // 最后一级返回街道信息
      }
      // 行政区查询
      this.district = new AMap.DistrictSearch(opts) // 注意：需要使用插件同步下发功能才能这样直接使用
      this.district.search('中国', (status, result) => {
        if (status === 'complete') {
          this.getData(result.districtList[0])
        }
      })
    },
    // 获取中国省份的的数据
    getData (data, level) {
      let citySelect = document.getElementById('city')
      let districtSelect = document.getElementById('district')
      let bounds = data.boundaries
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          let polygon = new AMap.Polygon({
            map: this.mymap,
            strokeWeight: 1,
            strokeColor: '#0091ea',
            fillColor: '#80d8ff',
            fillOpacity: 0.2,
            path: bounds[i]
          })
          this.polygons.push(polygon)
        }
        this.mymap.setFitView() // 地图自适应
      }
      // 清空下一级别的下拉列表
      if (level === 'province') {
        citySelect.innerHTML = ''
        districtSelect.innerHTML = ''
      } else if (level === 'city') {
        districtSelect.innerHTML = ''
      } else if (level === 'district') {
        // 解决add的报错,知道县级就可以了
        return
      }
      let subList = data.districtList
      if (subList) {
        let contentSub = new Option('--请选择--')
        let curlevel = subList[0].level
        let curList = document.querySelector('#' + curlevel)
        curList.add(contentSub)
        for (let i = 0, l = subList.length; i < l; i++) {
          let name = subList[i].name
          let levelSub = subList[i].level
          contentSub = new Option(name)
          contentSub.setAttribute('value', levelSub)
          contentSub.center = subList[i].center
          contentSub.adcode = subList[i].adcode
          curList.add(contentSub)
        }
      }
    },
    // 行政区规划图
    searchArea (obj) {
      // 清除地图上所有覆盖物
      let that = this
      for (let i = 0, l = this.polygons.length; i < l; i++) {
        this.polygons[i].setMap(null)
      }
      let option = obj.srcElement[obj.srcElement.options.selectedIndex]
      let adcode = option.adcode
      this.district.setLevel(option.value) // 行政区级别
      this.district.setExtensions('all')
      // 行政区查询
      // 按照adcode进行查询可以保证数据返回的唯一性
      this.district.search(adcode, function (status, result) {
        if (status === 'complete') {
          that.getData(result.districtList[0], obj.srcElement.id)
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
