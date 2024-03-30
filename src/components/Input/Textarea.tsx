import { ButtonProps, TextareaProps, Textarea as TaroTextarea, View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useState } from 'react'
import styles from './index.module.scss'
import Label from './Label'

interface Props extends TextareaProps {
  /**
   * 标签
   */
  label?: string
  /**
   * 是否必填
   */
  required?: boolean
  /**
   * 标签位置
   */
  labelPosition?: 'left' | 'top'
}

/**
 * 文本域组件
 */
const Textarea: React.FC<Props> = (props) => {
  const { labelPosition = 'left', label, required } = props
  // 输入框项类名
  const inputItemClassName = classNames(styles.inputItem, styles[labelPosition])
  // 输入框是否聚焦
  const [isFocus, setIsFocus] = useState(false)
  // 输入框类名
  const inputClassName = classNames(styles.input, styles.textarea, props.className, {
    [styles.focus]: isFocus
  })

  return (
    <View className={inputItemClassName}>
      {label && <Label required={required}>{label}</Label>}
      <TaroTextarea
        {...props}
        className={inputClassName}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      ></TaroTextarea>
    </View>
  )
}

export default Textarea
