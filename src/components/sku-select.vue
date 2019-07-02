<style scoped lang="sass">
.spec_title
  padding: 7px 10px
  line-height: 16px
  font-weight: 400

  .label
    display: inline-block
    width: 80px
</style>

<template lang="pug">
.container
  .spec_title(v-for="(spec, index) in skusData" :key="spec.id + '_id'")
    span.label {{spec.value}}：
    el-button(
      v-for="option in spec.leaf"
      :key="option.id"
      @click="selectSku(index, option)"
      :type="activeSku[index].option.id === option.id ? 'primary' : ''"
    ) {{option.value}}

  //- .spec_title(v-for="(sku, index) in activeSku" :key="index") {{sku.spec.value}}：{{sku.option.value}}
</template>

<script>
export default {
  data: () => ({
    activeSku: []
  }),

  props: {
    skusData: {
      type: Array,
      default() {
        return []
      },
    },
  },

  watch: {
    skusData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.activeSku = val.map(item => ({
          spec: {value: item.value, id: item.id},
          option: {},
        }))
      },
    }
  },

  methods: {
    selectSku(index, option) {
      if (this.activeSku[index].option && this.activeSku[index].option.id === option.id) return this.activeSku[index].option = {}
      this.activeSku[index].option = option
    },
  },
}
</script>
