import { Image } from '@tarojs/components'
import React from 'react'
import styles from './index.module.scss'
import Button from '@/components/Button'
import classNames from 'classnames'
import AddIcon from '@/static/table/add.svg'
import Taro from '@tarojs/taro'

const AddCourseButton: React.FC = () => {
  return (
    <Button
      className={classNames(styles.button)}
      onClick={() => {
        void Taro.navigateTo({
          url: '/pages/addCourse/index',
        })
      }}
    >
      <Image src={AddIcon} />
    </Button>
  )
}

export default AddCourseButton
