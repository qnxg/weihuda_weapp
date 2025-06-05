import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useState } from 'react'
import Label from '../Input/Label'
import styles from './index.module.scss'

interface IUploadProps {
  /**
   * 标签
   */
  label?: string
  /**
   * 是否必填
   */
  required?: boolean
  /**
   * 选中的图片路径
   */
  value: string
  /**
   * 当选择图片后的回调函数
   */
  onChoose?: (imgUrl: string) => any
}

/**
 * 图片上传组件
 * @example
 * ```tsx
 * <Upload label='图片' onChoose={(filePath) => setImgUrl(filePath)} />
 * ```
 */
export const Upload: React.FC<IUploadProps> = props => {
  const { label, required, value, onChoose } = props
  const [, setImgUrl] = useState(props.value || '')

  // 选择图片
  const handleChoose = () => {
    void Taro.chooseImage({
      count: 1,
      success(res) {
        const filePath = res.tempFilePaths[0]
        setImgUrl(filePath)
        if (onChoose) {
          onChoose(filePath)
        }
      },
    })
  }

  return (
    <View className={styles.upload}>
      {label && <Label required={required}>{label}</Label>}
      <View className={styles.content}>
        {value !== '' && (
          <View className={styles.image} onClick={handleChoose}>
            <Image src={value}></Image>
          </View>
        )}
        {value === '' && (
          <View className={styles.uploadButton} onClick={handleChoose}>
            <View className={styles.uploadIcon}></View>
            <View className={styles.placeholder}>点击上传图片</View>
          </View>
        )}
      </View>
    </View>
  )
}
