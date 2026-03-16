import { Button, Input, View, Navigator, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useRef } from 'react'
import styles from './index.module.scss'
import { postBind } from '@/apis/bind'
import { getTokenApi } from '@/apis/request'
import getLoginCode from '@/utils/getLoginCode'

const Second: React.FC = () => {
  const stuIdRef = useRef('')
  const stuPassRef = useRef('')

  const postData = async () => {
    await Taro.showLoading({
      mask: true,
      title: '加载中...',
    })
    try {
      const code = await getLoginCode()
      const res = await postBind({
        code: code,
        stuId: stuIdRef.current,
        password: stuPassRef.current,
      })

      console.log('res', res)
      await getTokenApi()
      Taro.hideLoading()
      await Taro.reLaunch({
        url: '/pages/index/index',
      })
    } catch (err) {
      if (err.message.includes('请前往个人门户修改密码后重试')) {
        await Taro.showModal({
          title: '请修改密码',
          content:
            '您的账号密码正确，但需要重新设置密码。请使用账号密码登录个人门户（不要使用微信扫码登录），并在专门的密码修改提示界面按要求重新修改密码。请严格按照该流程修改密码，在其他地方修改的密码无效。\n密码修改要求是强制的。如有疑问请联系学校信息化办。',
        })
      }
      if (err.message.includes('账号被锁定')) {
        await Taro.showModal({
          title: '账号被锁定',
          content:
            '由于您的账号密码输入错误次数过多，账号已被锁定。请10分钟之后再试。',
        })
      }
      console.log(err)
    }
  }

  /**
   * 提交表单
   */
  const submit = async () => {
    if (stuIdRef.current === '' || stuPassRef.current === '') {
      await Taro.showToast({
        title: '请检查必填项',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
      return
    }
    if (stuPassRef.current.length < 7) {
      const result = await Taro.showModal({
        title: '密码提示',
        content:
          '检测到你的个人门户密码是初始密码或密码强度较弱，建议修改后再绑定，是否继续绑定？',
        confirmText: '继续绑定',
        confirmColor: '#ff0000',
        cancelText: '之后绑定',
        cancelColor: '#19aa19',
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
      <View className={styles.tips}>
        如忘记密码，请前往个人门户：https://pt.hnu.edu.cn 进行密码重置。
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
