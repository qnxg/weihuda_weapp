import { Button, Input, Text, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classNames from 'classnames'
import { Fragment, useRef } from 'react'
import styles from './index.module.scss'
import { setLabPassword } from '@/apis/lab'
import Card from '@/components/Card'
import DisplayCard from '@/components/DisplayCard'
import { useAppSelector } from '@/utils/hooks/redux'


const Index: React.FC = () => {
  const router = useRouter()
  const params = router.params
  const showTips = params.tips === 'true'

  const { stuId } = useAppSelector(state => state.userInfo)
  const labPwdRef = useRef('')

  const submit = async () => {
    if (labPwdRef.current.length === 0) {
      await Taro.showToast({
        icon: 'none',
        title: '请输入密码',
      })
      return
    }
    await Taro.showLoading({
      mask: true,
      title: '正在绑定',
    })
    try {
      const data = await setLabPassword(labPwdRef.current)
      Taro.hideLoading()
      if (data.success) {
        await Taro.navigateBack()
        await Taro.showToast({
          icon: 'none',
          title: '绑定成功',
        })
      } else {
        await Taro.showToast({
          icon: 'none',
          title: `绑定失败：${data.msg}`,
        })
      }
    } catch {
      Taro.hideLoading()
    }
  }

  return (
    <Fragment>
      {showTips && (
        <Card>
          <Text className={classNames('text-red-600', styles.tips)}>
            您还未绑定大物实验平台账号，或是之前绑定的密码发生改变，请重新绑定！
          </Text>
        </Card>
      )}
      <DisplayCard title='账号信息'>
        <View></View>
        <View className={styles.dataItem}>
          <View className={styles.itemTitle}>学号：</View>
          <Input
            className={styles.inputArea}
            disabled={true}
            value={stuId}
            placeholder='请输入学号'
            placeholderClass={styles.placeholder}
            cursorSpacing={5}
          />
        </View>
        <View className={styles.dataItem}>
          <View className={styles.itemTitle}>密码：</View>
          <Input
            className={styles.inputArea}
            onInput={(e): void => {
              labPwdRef.current = e.detail.value
            }}
            placeholder='请输入大物实验平台密码'
            placeholderClass={styles.placeholder}
            cursorSpacing={5}
            password
          />
        </View>
        <View className={classNames('text-gray-600 mt-2', styles.tips)}>
          如忘记密码，请前往“湖南大学物理教学实验平台”进行密码重置。
        </View>
      </DisplayCard>
      <Button className={styles.confirmBtn} onClick={submit}>
        绑定
      </Button>
    </Fragment>
  )
}

export default Index
