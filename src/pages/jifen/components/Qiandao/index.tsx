import { View } from '@tarojs/components'
import React from 'react'
import styles from './index.module.scss'
import SignButton from './SignButton'

interface IQiandaoProps {
  signedCallback?: () => void
}

const Qiandao: React.FC<IQiandaoProps> = props => {
  return (
    <View className={styles.qiandaoCard}>
      <View>今日签到</View>
      <View>
        <SignButton
          className={styles.btn}
          signActionCallback={props.signedCallback}
        />
      </View>
    </View>
  )
}

export default Qiandao
