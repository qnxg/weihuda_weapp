import { Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React from 'react'
import styles from './index.module.scss'
import Button from '@/components/Button'
import AddIcon from '@/static/table/add.svg'

const AddCourseButton: React.FC<{ xn: number; xq: number }> = prop => {
  return (
    <Button
      className={classNames(styles.button)}
      onClick={() => {
        void Taro.navigateTo({
          url: `/pages/addCourse/index?xn=${prop.xn}&xq=${prop.xq}`,
        })
      }}
    >
      <Image src={AddIcon} />
    </Button>
  )
}

export default AddCourseButton
