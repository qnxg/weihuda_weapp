import { Button as TaroButton } from '@tarojs/components'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import type { ButtonProps } from '@tarojs/components'

interface Props extends ButtonProps {
  theme?: 'primary' | 'default' | 'plain'
  // | 'danger' | 'success' | 'warning' | 'success'
  disabled?: boolean
}

/**
 * 按钮组件
 */
const Button: React.FC<Props> = props => {
  const newProps = Object.assign({}, props)
  newProps.theme = props.theme || 'primary'
  newProps.className = classNames(
    props.className,
    styles.button,
    styles[newProps.theme],
    {
      [styles.disabled]: props.disabled,
    }
  )
  return (
    <TaroButton {...newProps} hoverClass={styles.buttonActive}></TaroButton>
  )
}

export default Button
