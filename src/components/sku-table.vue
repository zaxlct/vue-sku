<template lang="pug">
.container
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
import Component from 'vue-class-component'
import { flatten, creatIds } from './utils'
import { diffArary } from '../utils'

@Component({
  props: {
    specification: {
      type: Array,
      default() {
        return []
      },
    },
    productSkus: {
      type: Array,
      default() {
        return []
      },
    },
  },

  computed: {
    skusList() {
      /**
       * [
       *   { id: 1, text: '颜色', leaf: [{id: 11, text: '红色'}] },
       *   { id: 2, text: '尺寸', leaf: [{id: 21, text: '大'}, {id: 22, text: '小'}] }
       * ]
       */

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
      return flatten(this.specification).map(item => ({
        skus: item.skus,
        ids: creatIds(item.skus),
      }))
    },

    // 这里是表格的列 el-table-column，用 template slot-scope="scope" 能实现同样的效果
    columns() {
      const specList = this.specification.map(item => ({
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
          width: 180,
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
})
class SkuTable extends Vue {
  data = []
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

  coefficient = {
    purchase_coefficient: 0,
    guide_coefficient: 0,
  }
  columnsProps = {
    align: 'center',
    minWidth: 100,
  }

  diffIds(skusList1, skusList2) {
    // 两个数据的 ids 进行相差
    skusList1 = skusList1.map(item => item.ids)
    skusList2 = skusList2.map(item => item.ids)
    return diffArary(skusList1, skusList2)
  }

  initData(skusList) {
    if (this.productSkus && this.productSkus.length) {
      // 初始化数据
      this.data = this.productSkus
      this.$emit('update:productSkus', [])
      return
    }
    this.data = skusList.map(item => ({
      ...item,
      // 初始化属性
      format: '',
      guide_price: undefined,
      purchase_price: undefined,
      sell_price: undefined,
    }))
  }
}

export default SkuTable
</script>

