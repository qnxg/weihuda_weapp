import { Input as TaroInput, View } from '@tarojs/components'
import classNames from 'classnames'
import React, { useState } from 'react'
import styles from './index.module.scss'
import Label from './Label'
import type { InputProps} from '@tarojs/components';

interface Props extends InputProps {
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
 * 输入框组件
 */
const Input: React.FC<Props> = (props) => {
  const { labelPosition = 'left', label, required } = props
  // 输入框项类名
  const inputItemClassName = classNames(styles.inputItem, styles[labelPosition])
  // 输入框是否聚焦
  const [isFocus, setIsFocus] = useState(false)
  // 输入框类名
  const inputClassName = classNames(styles.input, props.className, {
    [styles.focus]: isFocus
  })

  return (
    <View className={inputItemClassName}>
      {label && <Label required={required}>{label}</Label>}
      <TaroInput
        {...props}
        className={inputClassName}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      ></TaroInput>
    </View>
  )
}

export default Input
