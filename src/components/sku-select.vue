<style lang="sass" scoped>
.container
  line-height: 30px
</style>

<template lang="pug">
.container
  p 选择配置：{{ selOptionsName.join(' + ') || '-' }}
  p 选择路径：{{ selPath || '-' }}
  p 价格：{{ price }}
  p 库存：{{ stock }}
  div(v-for='(options, title) in keys', :key='title')
    span {{ title }}：
    el-button(
      v-for='(symbol, name) in options'
      :key='symbol'
      :type="active[title] === name ? 'primary' : ''"
      :disabled='!canClick(symbol, name, title)'
      @click='select(symbol, name, title)'
    ) {{ name }} ({{ symbol }})
</template>

<script>
export default {
	props: {
    skusData: {
      type: Array,
      default() {
        return []
      },
    },
  },
	data() {
		return {
			active: {},
		}
	},
	computed: {
    specs() {
      return this.skusData.map(item => item.value)
    },

    spec_leafs() {
      return this.skusData.map(item => item.leaf.map(item => item.value))
    },

    keys() {
      let keys = {}
      let symbol = 0
      for (let i in this.specs) {
        let option = {};
        for (let j in this.spec_leafs[i]) {
          option[this.spec_leafs[i][j]] = symbol++
        }
        keys[this.specs[i]] = option
      }
      return keys
    },

    values() {
      let arr = this.specs.map((v, k) =>
        this.spec_leafs[k].map(l => [this.keys[v][l], l, v])
      )

      let path = []
      let paths = {}
      let len = arr.length
      if (!len) return {}
      let func = (arr, n) => {
        for (let i of arr[n]) {
          path.push(i);
          if (n !== len - 1) {
            func(arr, n + 1)
          } else {
            paths[
              path
                .map(v => v[0])
                .sort()
                .join(',')
            ] = {
              // 设置库存和价格
              stock: 1,
              price: 1,
              symbols: path.map(v => v[0]),
              values: path.map(v => v[1]),
              titles: path.map(v => v[2]),
            }
          }
          path.pop()
        }
      }
      func(arr, 0)
      return paths
    },

		// 选择的属性symbol集合
		selIds() {
			let sel = []
			for(let optionName in this.active) this.active[optionName] && sel.push(this.keys[optionName][this.active[optionName]])
			return sel
		},
		// 选择的属性symbol路径
		selPath() {
			return this.getPath(this.selIds)
		},
		// 选择的属性值集合
		selOptionsName() {
			let sel = []
			for(let a in this.active) if(this.active[a]) sel.push(this.active[a])
			return sel
		},
		// 价格范围
		price() {
			let obj = this.skus[this.selPath]
			let prices = obj && obj.prices
			if(prices) {
				let maxPrice = Math.max.apply(Math, prices)
        let minPrice = Math.min.apply(Math, prices)
        return maxPrice > minPrice ? minPrice + "-" + maxPrice : maxPrice
			} else {
				return '-'
			}
		},
		// 库存（有可能是总库存）
		stock() {
			let obj = this.skus[this.selPath]
			return obj && obj.stock || '-'
		},
		// 核心算法(来源: http://www.cnblogs.com/purediy/archive/2012/12/02/2798454.html)
		skus() {
      let res = {}
      let addRes = (k, s) => {
        if(res[k]) res[k].stock += s.stock, res[k].prices.push(s.price)
        else res[k] = {stock: s.stock, prices: [s.price], }
      }
      let combine = (skas, n, s) => {
        let len = skas.length
        skas.forEach((key, i) => {
          for(let j = i + 1; j < len; ++j) if(j + n <= len) {
            let tmp = skas.slice(j, j + n), gk = this.getPath(tmp.concat(key))
            addRes(gk, s)
          }
        })
      }
      let keys = Object.keys(this.values)
      for(let key of keys) {
        let s = this.values[key]
        let skas = key.split(',').sort()
        let len = skas.length
        for(let j = 0; j < len; ++j) {
          addRes(skas[j], s)
          j > 0 && j < len-1 && combine(skas, j, s);
        }
        res[this.getPath(key.split(','))] = {
          stock:s.stock,
          prices:[s.price],
        }
      }
			return res
		},
  },

	watch: {
		keys: {
      deep: true,
      immediate: true,
      handler(val) {
        let active = {}
        Object.keys(val).forEach(key => active[key] = null)
        this.active = active
      }
		},
  },

	methods: {
    // 组合选择的属性symbol路径
    getPath(selIds) {
      return selIds.sort().join(',')
    },

		// 点击事件
		select(symbol, name, title) {
			if (this.active[title] === name) this.active[title] = null
      else this.active[title] = name
		},
		// 判断是否可点击
		canClick(symbol, name, title) {
			// 如果元素本身已选中， 则可以点击（让用户取消选择）
			if(this.selIds.includes(symbol)) return true
			// 过滤已选中的当前选项层的所有属性值的symbol的集合
      let notSiblingsSelIds = this.selIds.filter(v => v !== symbol).filter(v => Object.values(this.keys[title]).includes(v))
      let sku = this.skus[this.getPath(notSiblingsSelIds.concat(symbol))]
			return sku && sku.stock > 0
		},
	},
}
</script>
