import { postBind } from '@/apis/back/bind'
import { getTokenApi } from '@/apis/back/token'
import { Button, Input, View, Navigator, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useRef } from 'react'
import styles from './index.module.scss'
import getLoginCode from '@/utils/getLoginCode'

const Second: React.FC = () => {
  const stuIdRef = useRef('')
  const stuPassRef = useRef('')

  const postData = async () => {
    Taro.showLoading({
      mask: true,
      title: '加载中...'
    })
    try {
      const code = await getLoginCode();
      const res = await postBind({
        code,
        stuId: stuIdRef.current,
        stuPassword: stuPassRef.current,
        hdjwPassword: stuPassRef.current
      })

      console.log('res', res)
      await getTokenApi()
      Taro.reLaunch({
        url: '/pages/index/index'
      })
      Taro.hideLoading()
    } catch(err) {
      console.log(err)
    }
    
  }

  /**
   * 提交表单
   */
  const submit = async () => {
    if (stuIdRef.current === '' || stuPassRef.current === '' 
    ) {
      Taro.showToast({
        title: '请检查必填项',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      return
    }
    if (stuPassRef.current.length < 7) {
      const result = await Taro.showModal({
        title: '密码提示',
        content: '检测到你的个人门户密码是初始密码或密码强度较弱，建议修改后再绑定，是否继续绑定？',
        confirmText: '继续绑定',
        confirmColor: '#ff0000',
        cancelText: '之后绑定',
        cancelColor: '#19aa19'
      })
      if (!result.confirm) {
        return
      }
    }
    await postData()
  }

  return (
    <View className={styles.footArea}>
      <View className={styles.hintText}>请输入学号密码</View>
      <View className={styles.formCard}>
        <View className={styles.dataItem}>
          <View className={styles.itemTitle}>学号：</View>
          <Input
            className={styles.inputArea}
            onInput={(e): void => {
              stuIdRef.current = e.detail.value
            }}
            placeholder='请输入学号'
            placeholderClass={styles.placeholder}
            cursorSpacing={5}
          />
        </View>
        <View className={styles.dataItem}>
          <View className={styles.itemTitle}>个人门户密码：</View>
          <Input
            className={styles.inputArea}
            onInput={(e): void => {
              stuPassRef.current = e.detail.value
            }}
            placeholder='请输入个人门户密码'
            placeholderClass={styles.placeholder}
            cursorSpacing={5}
            password
          />
        </View>
      </View>
      <Button className={styles.confirmBtn} onClick={submit}>
        进行验证
      </Button>
      <View className={styles.feedbackLink}>
        <Navigator url='/pages/feedback/index?noAuth=1'>
          <Text>问题反馈</Text>
        </Navigator>
      </View>
    </View>
  )
}

export default Second
