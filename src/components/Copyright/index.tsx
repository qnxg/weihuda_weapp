import { View } from '@tarojs/components'
import styles from './index.module.scss'

const Copyright: React.FC = () => {
  return (
    <View className={styles.copyright}>
      <View>Copyright © 2017-2025</View>
      <View className={styles.logo1000} />
    </View>
  )
}

export default Copyright
