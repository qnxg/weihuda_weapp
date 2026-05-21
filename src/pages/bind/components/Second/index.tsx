import { Button, Input, View, Navigator, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useRef, useState } from 'react'
import styles from './index.module.scss'
import { getPow, postBind } from '@/apis/bind'
import { getTokenApi } from '@/apis/request'
import { encryptBindPassword } from '@/utils/encrypt'
import getLoginCode from '@/utils/getLoginCode'
import { solvePowInWorker } from '@/utils/pow'

const Second: React.FC = () => {
  const stuIdRef = useRef('')
  const stuPassRef = useRef('')
  const [loadingText, setLoadingText] = useState<string | null>(null)

  const postData = async () => {
    try {
      setLoadingText('正在进行安全验证，可能需要一些时间...')
      const { ticket, difficulty } = await getPow(stuIdRef.current)
      const nonce = await solvePowInWorker(ticket, difficulty)
      setLoadingText('正在加载...')
      const encryptedPassword = encryptBindPassword(stuPassRef.current)
      const code = await getLoginCode()
      await postBind({
        code: code,
        stuId: stuIdRef.current,
        password: encryptedPassword,
        powTicket: ticket,
        powAnswer: nonce,
      })
      await getTokenApi()
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
    } finally {
      setLoadingText(null)
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
    await postData()
  }

  return (
    <View className={styles.footArea}>
      {loadingText && (
        <View className={styles.loadingMask} catchMove>
          <View className={styles.loadingPanel}>
            <View className={styles.loadingSpinner} />
            <Text className={styles.loadingText}>{loadingText}</Text>
          </View>
        </View>
      )}
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
