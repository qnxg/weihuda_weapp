import { postZhihuApi } from '@/apis/zhihu'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input/Input'
import Label from '@/components/Input/Label'
import Textarea from '@/components/Input/Textarea'
import { useAppSelector } from '@/hooks/redux'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React, { useState } from 'react'
import styles from './index.module.scss'

//TODO: 可以从数据库获取标签后更新
const defaultTags = [
  {
    label: '讨论',
    value: '讨论'
  },
  {
    label: '失物招领',
    value: '失物招领'
  },
  {
    label: '活动',
    value: '活动'
  },
  {
    label: '讲座',
    value: '讲座'
  },
  {
    label: '通知',
    value: '通知'
  },
  {
    label: '其他',
    value: '其他'
  }
]

const getTitle = (content: string, length = 20) => {
  if (content.length <= length) {
    return content
  }
  return content.slice(0, length) + '...'
}

const Index: React.FC = () => {
  // 选中的标签
  const [selectedTag, setSelectedTag] = useState('')
  // 标题
  const [title, setTitle] = useState('')
  // 内容
  const [content, setContent] = useState('')
  // 用户信息
  const userInfo = useAppSelector((state) => state.userInfo)

  // 提交时
  const onSubmit = async () => {
    // 非空校验
    if (!title || title.trim() === '') {
      Taro.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return
    }
    if (!content || content.trim() === '') {
      Taro.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    if (!selectedTag) {
      Taro.showToast({
        title: '请选择分类',
        icon: 'none'
      })
      return
    }

    await postZhihuApi({
      content: content.trim().split('\n').map((item) => `<p>${item}</p>`).join(''),
      title: getTitle(title.trim()),
      stuId: userInfo.stuId,
      type: 'article',
      tags: selectedTag,
      status: 0
    })
    Taro.showToast({
      title: '发布成功',
      icon: 'success'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  return (
    <Card>
      <Input label='标题' value={title} required onInput={(v) => setTitle(v.detail.value)} />
      <Textarea
        label='内容'
        required
        value={content}
        maxlength={1000}
        onInput={(v) => {
          setContent(v.detail.value)
        }}
        placeholder='请输入内容'
      />
      <Label required>分类</Label>
      <View className={styles.tagsWrapper}>
        {defaultTags.map((item) => {
          return (
            <View
              className={classNames(styles.tagsItem, {
                [styles.selected]: selectedTag === item.value
              })}
              onClick={() => setSelectedTag(item.value)}
              key={item.value}
            >
              {item.label}
            </View>
          )
        })}
      </View>
      <Button className={styles.btn} onClick={onSubmit}>
        发布
      </Button>
    </Card>
  )
}

export default Index
