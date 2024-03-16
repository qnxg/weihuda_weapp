import { ButtonProps, Button as TaroButton } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'

interface Props extends ButtonProps {}

/**
 * 按钮组件
 */
const Button: React.FC<Props> = (props) => {
  console.log('Button', props)
  props.className = classNames(props.className, styles.button)
  return <TaroButton {...props}></TaroButton>
}

export default Button
