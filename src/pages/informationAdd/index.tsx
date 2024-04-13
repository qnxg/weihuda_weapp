import { uploadImgApi } from '@/apis/back/upload'
import { postZhihuApi } from '@/apis/zhihu'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input/Input'
import Label from '@/components/Input/Label'
import Textarea from '@/components/Input/Textarea'
import { Upload } from '@/components/Upload'
import { useAppSelector } from '@/hooks/redux'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import defaultTags from '../information/defaultTags'
import styles from './index.module.scss'

const getTitle = (content: string, length = 20) => {
  if (content.length <= length) {
    return content
  }
  return content.slice(0, length) + '...'
}

const Index: React.FC = () => {
  // 标题
  const [title, setTitle] = useState('')
  // 内容
  const [content, setContent] = useState('')
  // 图片
  const [imgUrl, setImgUrl] = useState('')
  // 选中的标签
  const [selectedTag, setSelectedTag] = useState('')
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
    // 有图片则上传图片
    let uploadedImgUrl = ''
    if (imgUrl) {
      // 如果有图片那就先上传图片，拿到图片地址后再提交表单
      Taro.showToast({ title: '正在上传图片', icon: 'loading' })
      try {
        uploadedImgUrl = await uploadImgApi(imgUrl)
        Taro.showToast({ title: '上传图片成功', icon: 'none' })
      } catch (error) {
        Taro.showToast({ title: '上传图片失败', icon: 'none' })
        return
      }
    }

    // 把内容转换成html格式，每行变成一个p标签
    let finalContent: string | string[] = content
      .trim()
      .split('\n')
      .map((item) => `<p>${item}</p>`)
    // 如果有图片则插入图片
    if (uploadedImgUrl) {
      finalContent.push(`<p><img style="width: 70%;" src="${uploadedImgUrl}" /></p>`)
    }
    finalContent = finalContent.join('')
    // 提交表单
    await postZhihuApi({
      content: finalContent,
      title: getTitle(title.trim()),
      stuId: userInfo.stuId,
      publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      cover: uploadedImgUrl ? uploadedImgUrl : null,
      type: 'article',
      tags: selectedTag,
      status: 0
    })
    // 提交成功后清空表单
    setContent('')
    setTitle('')
    setImgUrl('')
    setSelectedTag('')
    // 提示用户
    Taro.showToast({
      title: '发布成功',
      icon: 'success'
    })
    // 返回上一页
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  return (
    <Card>
      <Input label='标题' placeholder='请输入标题' value={title} required onInput={(v) => setTitle(v.detail.value)} />
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
      <Upload label='图片' value={imgUrl} onChoose={(filePath) => setImgUrl(filePath)} />
      <Label required>分类</Label>
      <View className={styles.tagsWrapper}>
        {defaultTags
          .filter((v) => !!v.value)
          .map((item) => {
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
