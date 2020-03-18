<style scoped lang="sass">
.spec_title
  display: flex
  padding: 7px 10px
  line-height: 16px
  font-weight: 400
  align-items: center

  .spec_list
    flex: 1
    display: flex
    flex-wrap: wrap
</style>

<template lang="pug">
.container(v-loading="!specification.length" :style={minHeight: showSkuTable ? '210px' : '150px'})
  .spec_title(v-for="(spec, index) in specification" :key="spec.id + '_id'")
    span.label {{spec.value}}：
    .spec_list
      el-button.mb10(
        v-for="option in spec.leaf"
        :key="option.id"
        @click="selectSku(index, option)"
        :type="activeSku[index] && activeSku[index].option.id === option.id ? 'primary' : ''"
      ) {{option.value}}

  //- egrid 是 el-table 的封装
  egrid(
    v-if="showSkuTable"
    border
    empty-text="请先选择规格"
    :data="tableData"
    :columns="columns"
    :columns-props="{align: 'center', minWidth: 90}"
    :columns-handler="columnsHandler"
  )
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { param2Data } from './sku2param'

@Component({
  props: {
    product_skus: Array,
    showSkuTable: {
      type: Boolean,
      default: true,
    },
    // 下面参数是可选的
    showMaterials: Boolean,
    product_materials: Array,
    columnsHandler: Function,
    sell_price_offer: Number,
    sell_price_offer_end_date: [Date, String],
    sell_price_offer_start_date: [Date, String],
  },

  watch: {
    specification: {
      immediate: true,
      deep: true,
      handler(val) {
        this.activeSku = val.map(item => ({
          spec: { value: item.value, id: item.id },
          option: {},
        }))
        this.activeSkuData = {}
      },
    },
  },

  computed: {
    paramData() {
      if (!this.showMaterials) return param2Data(this.product_skus)
      if (!this.product_materials) return null
      return param2Data(this.product_skus, this.product_materials)
    },

    productSkus() {
      if (!this.paramData) return []
      return this.paramData.productSkus
    },

    specification() {
      if (!this.paramData) return []
      return this.paramData.specification
    },

    tableData() {
      const activeSkuData = this.activeSkuData
      if (activeSkuData && activeSkuData.sell_price) return [activeSkuData]
      return []
    },

    // 这里是表格的列 el-table-column，用 template slot-scope="scope" 能实现同样的效果
    columns() {
      if (
        this.sell_price_offer &&
        this.sell_price_offer_start_date &&
        this.sell_price_offer_end_date
      ) {
        return [
          { label: '规格', prop: 'format' },
          { label: '厂家指导价', prop: 'guide_price' },
          { label: '标价', prop: 'sell_price' },
          {
            label: '活动价',
            formater: row =>
              this.sell_price_offer === 10
                ? '无'
                : (row.sell_price * this.sell_price_offer) / 10,
          },
          {
            label: '活动日期',
            formater: () =>
              this.sell_price_offer_start_date
                ? this.sell_price_offer_start_date +
                  '-' +
                  this.sell_price_offer_end_date
                : '无',
          },
          { label: '总库存', prop: 'stock', width: 80 },
          // { label: '可用数', prop: 'available'},
          { label: '锁定数', prop: 'destine', width: 80 },
          { label: '门店库存数', prop: 'shop_quantity', width: 80 },
          // { label: '在途数', prop: 'road'},
          { label: '仓库库存数', prop: 'warehouse_quantity', width: 80 },
        ]
      }
      return [
        { label: '规格', prop: 'format' },
        { label: '厂家指导价', prop: 'guide_price' },
        { label: '标价', prop: 'sell_price' },
        { label: '总库存', prop: 'stock', width: 80 },
        { label: '锁定数', prop: 'destine', width: 80 },
        { label: '门店库存数', prop: 'shop_quantity', width: 80 },
        { label: '仓库库存数', prop: 'warehouse_quantity', width: 80 },
      ]
    },
  },
})
class SkuSelect extends Vue {
  activeSku = []
  activeSkuData = {}

  selectSku(index, option) {
    if (
      this.activeSku[index] &&
      this.activeSku[index].option &&
      this.activeSku[index].option.id === option.id
    ) {
      this.activeSku[index].option = {}
      this.activeSkuData = {}
      return
    }
    this.activeSku[index].option = option
    const activeSkuData = this.productSkus.find(product_sku =>
      this.activeSku.every(
        sku =>
          product_sku.ids.includes(sku.sepc ? sku.sepc.id : '') &&
          product_sku.ids.includes(sku.option ? sku.option.id : ''),
      ),
    )
    this.activeSkuData = activeSkuData
    if (activeSkuData && activeSkuData.product_sku_id)
      this.$emit('seleted', activeSkuData.product_sku_id)
  }
}

export default SkuSelect
</script>
