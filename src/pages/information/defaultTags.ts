import Taro from '@tarojs/taro'
import { parseJSON } from '@/utils/tool'

export interface TagItem {
  label: string
  value: string
}

function getDefaultTags(): TagItem[] {
  try {
    const storageTags = parseJSON(Taro.getStorageSync('zhihuTags'))
    if (storageTags != null && storageTags.length) {
      return storageTags as TagItem[]
    }
  } catch {}
  return [
    {
      label: '首页',
      value: '',
    },
    {
      label: '失物招领',
      value: '失物招领',
    },
    {
      label: '学习',
      value: '学习',
    },
    {
      label: '活动',
      value: '活动',
    },
    {
      label: '讲座',
      value: '讲座',
    },
    {
      label: '通知',
      value: '通知',
    },
    {
      label: '其他',
      value: '其他',
    },
  ]
}

const defaultTags = getDefaultTags()

export default defaultTags
