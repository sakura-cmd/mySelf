<template>
  <div class="demo">
    <el-button>
      <router-link to="home">高德地图组件</router-link>
    </el-button>
    <br>
    <p>千分位</p>
    输入金额(千分位显示): <el-input
      type="text"
      v-model="num"
      @input="changeNum"
      style="width:200px;"
      placeholder="请输入金额"
    ></el-input>
  </div>
</template>

<script>
export default {
  data () {
    return {
      num: ''
    }
  },
  methods: {
    // 清除千分位的逗号
    clearMoney (str) {
      return str.toString().replace(/,/g, '')
    },
    // 输入框显示金额千分位
    checkFormatMoney (value) {
      let val = this.clearMoney(value)
      let res = val.toString().replace(/\d+/, Qnum => {
        return Qnum.replace(/(\d)(?=(\d{3})+$)/g, $1 => {
          return $1 + ','
        })
      })
      return res
    },
    changeNum (value) {
      this.num = this.checkFormatMoney(value)
      console.log(this.num)
    }
  }
}
</script>

<style>
</style>
