import {
  createUniqueString
} from '../utils'
import {
  creatIds
} from './utils'

export function param2Data(product_skus_data, product_materials) {
  if (!product_skus_data || !product_skus_data.length) return
  let specificationObj = {}

  // 储存所有 spec 的随机生成的 id
  let spec_id_dict = {
    // '颜色': 'xxxid',
    // '皮质': 'xxxid',
  }

  // 储存所有 option 的随机生成的 id
  let option_id_dict = {
    // '红色': 'xxxid',
    // '绿色': 'xxxid',
    // '蓝色': 'xxxid',
    // '一级皮': 'xxxid',
    // '二级皮': 'xxxid',
    // '三级皮': 'xxxid',
  }

  const productSkus = product_skus_data.map(item => {
    let skusObj = {
      ...item,
      product_sku_id: item.id,
      skus: item.product_sku.map(sku => {
        const spec_random_id = createUniqueString() + '_id'
        const option_random_id = createUniqueString() + '_id'

        // 加上 if ，防止 dict 里的 id 被覆盖，每次只记录第一次生成的 id
        if (!spec_id_dict[sku.key]) spec_id_dict[sku.key] = spec_random_id
        if (!option_id_dict[sku.value]) option_id_dict[sku.value] = option_random_id
        const sepc_id = spec_id_dict[sku.key]
        const option_id = option_id_dict[sku.value]

        specificationObj[sku.key] = {
          value: sku.key,
          id: sepc_id,
          leaf: {
            ...(specificationObj[sku.key] ? specificationObj[sku.key].leaf : {}),
            [sku.value]: {
              value: sku.value,
              id: option_id,
            },
          },
        }

        return {
          k_id: sepc_id,
          k: sku.key,
          v_id: option_id,
          v: sku.value,
        }
      })
    }
    // product_materials 有所有的物料，但不一定有所有 sku
    // product_skus 有所有的 SKU
    // 把 product_materials 分配到 product_skus 里（用物料是否相等来判断）
    if (product_materials && product_materials.length) {
      skusObj.product_materials = product_materials.filter(material => JSON.stringify(material.product_sku.product_sku) === JSON.stringify(item.product_sku))
    }
    return {
      ...skusObj,
      ids: creatIds(skusObj.skus),
    }
  })

  const specification = Object.values(specificationObj).map(item => ({
    ...item,
    leaf: Object.values(item.leaf),
  }))
  return {
    productSkus,
    specification,
  }
}