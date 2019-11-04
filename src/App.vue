<template lang="pug">
#app
  SkuDemo(ref="SkuDemo" v-loading="loading")

  el-button(type="primary" @click="getSkuData") 获取sku数据
</template>

<script>
import SkuDemo from './components/index'
import MockData from './components/mock'

export default {
  components: {
    SkuDemo,
  },

  data: () => ({
    loading: true,
  }),

  async mounted() {
    const data = await this._fetchData()
    this.$refs.SkuDemo._setData(data)
    this.loading = false
  },

  methods: {
    // 模拟请求初始化数据
    _fetchData: () =>
      new Promise(resolve => setTimeout(() => resolve(MockData), 1000)),

    // 得到 sku 数据
    getSkuData() {
      const product_skus = this.$refs.SkuDemo._getData().map(item => {
        const { format, guide_price, purchase_price, sell_price, skus } = item
        const skuText = skus.reduce(
          (str, prev) => `${str}${prev.k}：${prev.v}——`,
          '',
        )
        if (!purchase_price) {
          this.$message.error(skuText + ' 未输入进价')
          throw '请输入进价'
        } else if (!sell_price) {
          this.$message.error(skuText + ' 未输入标价')
          throw '请输入标价'
        }
        return {
          format,
          guide_price,
          purchase_price,
          sell_price,
          product_sku: skus.map(sku => ({
            key: sku.k,
            value: sku.v,
          })),
        }
      })
      console.log(product_skus)
    },
  },
}
</script>
