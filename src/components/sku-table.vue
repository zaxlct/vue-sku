<style lang="sass" scoped>
.flex
  display: flex

  .guide_coefficient
    margin-right: 20px
</style>

<template lang="pug">
.container
  .flex
    el-form.guide_coefficient(:inline="true" :model="coefficient")
      el-form-item(label="指导价倍数" prop="guide_coefficient")
        el-input-number(
          :step="0.1"
          :min="1"
          :precision="2"
          v-model="coefficient.guide_coefficient"
        )
      el-form-item
        el-button(type="primary" @click="setGuideCoefficient") 批量设置指导价倍数

    el-form(:inline="true" :model="coefficient")
      el-form-item(label="标价倍数" prop="purchase_coefficient")
        el-input-number(
          :step="0.1"
          :min="1"
          :precision="2"
          v-model="coefficient.purchase_coefficient"
        )
      el-form-item
        el-button(type="primary" @click="setPurchaseCoefficient") 批量设置标价倍数

  //- egrid 是 el-table 的封装
  egrid(
    border
    max-height="800"
    v-bind="$attrs"
    v-on="$listeners"
    :data="data"
    :columns="columns"
    :columns-props="columnsProps"
  )
</template>

<script>
import Vue from 'vue'
import { flatten } from '../utils/sku'
import { diffArary } from '../utils'

export default {
  props: {
    skusData: {
      type: Array,
      default() {
        return []
      },
    },
  },

  computed: {
    skusList() {
      /**
       * output:
       * [
       *   {
       *     ids: '1-11_2-21',
       *     skus: [{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":21,"v":"大"}],
       *   },
       *   {
       *     ids: '1-11_2-22',
       *     skus: [{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}],
       *   }
       * ]
       */
      return flatten(this.skusData).map(item => ({
        skus: item.skus,
        ids: item.skus.reduce(
          (total, prev, index) =>
            `${total}${prev.k_id}-${prev.v_id}${
              index === item.skus.length - 1 ? '' : '_'
            }`,
          '',
        ),
      }))
    },

    columns() {
      const specList = this.skusData.map(item => ({
        label: item.value,
        formater(row) {
          const sku = row.skus.find(sku => sku.k === item.value)
          return sku.v
        },
      }))
      return [
        ...specList,
        {
          label: '规格',
          width: 120,
          component: Vue.extend({
            props: ['row'],
            render() {
              return (
                <ElInput
                  placeholder="请输入规格"
                  value={this.row.format}
                  oninput={e => (this.row.format = e.trim())}
                ></ElInput>
              )
            },
          }),
        },
        {
          label: '厂家指导价',
          width: 150,
          component: Vue.extend({
            props: ['row'],
            render() {
              return (
                <ElInputNumber
                  placeholder="请输入厂家指导价"
                  value={this.row.guide_price}
                  step={1}
                  min={0}
                  controls={false}
                  precision={0}
                  oninput={e => (this.row.guide_price = e)}
                ></ElInputNumber>
              )
            },
          }),
        },
        {
          label: '进价',
          width: 150,
          component: Vue.extend({
            props: ['row'],
            render() {
              return (
                <ElInputNumber
                  placeholder="请输入进价"
                  value={this.row.purchase_price}
                  step={1}
                  min={0}
                  controls={false}
                  precision={0}
                  oninput={e => (this.row.purchase_price = e)}
                ></ElInputNumber>
              )
            },
          }),
        },
        {
          label: '标价',
          width: 150,
          component: Vue.extend({
            props: ['row'],
            render() {
              return (
                <ElInputNumber
                  placeholder="请输入标价"
                  value={this.row.sell_price}
                  step={1}
                  min={0}
                  controls={false}
                  precision={0}
                  oninput={e => (this.row.sell_price = e)}
                ></ElInputNumber>
              )
            },
          }),
        },
      ]
    },
  },

  watch: {
    skusList: {
      deep: true,
      immediate: true,
      handler(newSkus, oldSkus) {
        if (!newSkus.length) return (this.data = [])
        if (!oldSkus || !oldSkus.length) return this.initData(newSkus)
        if (newSkus.length === oldSkus.length) {
          // 当规格名和规格值数量未发生变化，更新 skus 即可
          return (this.data = newSkus.map((item, index) => ({
            ...this.data[index],
            ...item,
          })))
        }

        // 当规格名的数量发生了变化
        if (newSkus[0].skus.length !== oldSkus[0].skus.length)
          return this.initData(newSkus)

        const diffIds = this.diffIds(newSkus, oldSkus)
        if (newSkus.length > oldSkus.length) {
          // 当添加了规格值
          let data = []
          newSkus.forEach(item => {
            const sku = this.data.find(_item => _item.ids === item.ids)
            if (sku) {
              data.push(sku)
            } else {
              data.push({
                ...item,
                format: '',
                guide_price: undefined,
                purchase_price: undefined,
                sell_price: undefined,
              })
            }
          })
          this.data = data
        } else {
          // 当删除了规格值
          this.data = this.data.filter(_item => !diffIds.includes(_item.ids))
        }
      },
    },
  },

  data: () => ({
    data: [],
    // [
    //   {
    //     ids: '1-11_2-21',
    //     skus: [{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":21,"v":"大"}],
    //     price: '',
    //     guide: '',
    //   },
    //   {
    //     ids: '1-11_2-22',
    //     skus: [{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}],
    //     price: '',
    //     guide: '',
    //   }
    // ]

    coefficient: {
      purchase_coefficient: 0,
      guide_coefficient: 1.2,
    },
    columnsProps: {
      align: 'center',
      minWidth: 100,
    },
  }),

  methods: {
    diffIds(skusList1, skusList2) {
      // 两个数据的 ids 进行相差
      skusList1 = skusList1.map(item => item.ids)
      skusList2 = skusList2.map(item => item.ids)
      return diffArary(skusList1, skusList2)
    },

    initData(skusList) {
      this.data = skusList.map(item => ({
        ...item,
        // 初始化属性
        format: '',
        guide_price: 100, // 为了方便展示数据，这里默认设置为 100
        purchase_price: undefined,
        sell_price: undefined,
      }))
    },

    setGuideCoefficient() {
      const guide_coefficient = this.coefficient.guide_coefficient
      this.data = this.data.map(item => ({
        ...item,
        purchase_price: (item.guide_price || 0) * guide_coefficient,
      }))
    },

    setPurchaseCoefficient() {
      const purchase_coefficient = this.coefficient.purchase_coefficient
      this.data = this.data.map(item => ({
        ...item,
        sell_price: (item.purchase_price || 0) * purchase_coefficient,
      }))
    },
  },
}
</script>
