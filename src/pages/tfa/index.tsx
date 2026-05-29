import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { getTFA, sendTFASms, verifyTFA } from '@/apis/bind'
import { getRequestErrorMessage } from '@/apis/request'
import Button from '@/components/Button'
import Input from '@/components/Input/Input'

const COOLDOWN_SECONDS = 60

const goBack = (): void => {
  const pages = Taro.getCurrentPages()
  if (pages.length > 1) {
    void Taro.navigateBack()
    return
  }
  void Taro.switchTab({ url: '/pages/index/index' })
}

const Index: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [phoneLoading, setPhoneLoading] = useState(true)
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const countdownRef = useRef(0)

  useEffect(() => {
    countdownRef.current = countdown
  }, [countdown])

  const loadPhone = useCallback(async () => {
    setPhoneLoading(true)
    try {
      const tfaInfo = await getTFA()
      if (!tfaInfo) {
        goBack()
        return
      }
      setPhone(tfaInfo.phone)
    } catch {
      goBack()
    } finally {
      setPhoneLoading(false)
    }
  }, [])

  useDidShow(() => {
    void loadPhone()
  })

  const isCounting = countdown > 0
  useEffect(() => {
    if (!isCounting) {
      return
    }
    const timer = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [isCounting])

  const phoneReady = !phoneLoading && phone.length > 0

  const handleSendCode = async (): Promise<void> => {
    if (!phoneReady || countdownRef.current > 0) {
      return
    }
    try {
      await sendTFASms()
      setCountdown(COOLDOWN_SECONDS)
    } catch (e) {
      const message = getRequestErrorMessage(e)
      if (message.includes('未找到双因子')) {
        goBack()
      }
    }
  }

  const handleSubmit = async (): Promise<void> => {
    if (!phoneReady) {
      return
    }
    const trimmed = code.trim()
    if (!trimmed) {
      await Taro.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    try {
      await verifyTFA(trimmed)
      await Taro.showToast({ title: '验证成功', icon: 'success' })
      goBack()
    } catch (e) {
      const message = getRequestErrorMessage(e)
      if (message.includes('未找到双因子') || message.includes('已过期')) {
        goBack()
      }
    }
  }

  const handleCancel = (): void => {
    goBack()
  }

  return (
    <View className={styles.page}>
      <View className={styles.panel}>
        <Text className={styles.title}>需要验证码</Text>
        <View className={styles.fieldBlock}>
          <View className={styles.codeField}>
            <View className={styles.codeLabelWrap}>
              <Text className={styles.codeLabel}>手机号</Text>
            </View>
            <View className={styles.codeInputRow}>
              <Input
                itemClassName={styles.codeInputItem}
                className={styles.codeInputBox}
                value={phoneLoading ? '' : phone}
                placeholder={phoneLoading ? '加载中…' : ''}
                disabled
              />
            </View>
          </View>
        </View>
        <View className={styles.fieldBlock}>
          <View className={styles.codeField}>
            <View className={styles.codeLabelWrap}>
              <Text className={styles.codeLabel}>验证码</Text>
            </View>
            <View className={styles.codeInputRow}>
              <Input
                itemClassName={styles.codeInputItem}
                className={styles.codeInputBox}
                value={code}
                placeholder='请输入验证码'
                maxlength={12}
                type='number'
                disabled={!phoneReady}
                onInput={e => setCode(e.detail.value)}
              />
              <View className={styles.sendBtnWrap}>
                <Button
                  className={styles.sendBtn}
                  theme='plain'
                  disabled={!phoneReady || countdown > 0}
                  onClick={() => void handleSendCode()}
                >
                  {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
                </Button>
              </View>
            </View>
          </View>
        </View>
        <View className={styles.hint}>
          <View>1. 验证通过后再次刷新界面即可继续正常使用。</View>
          <View>
            2.
            如果未绑定手机号，或之前绑定的手机号已经弃用，请联系学校信息化办进行重新绑定。
          </View>
          <View>
            {
              '3. 如有其他问题，请点击“我的”->“我要反馈”，向我们进行问题反馈，我们会尽快处理。'
            }
          </View>
        </View>
        <View className={styles.actions}>
          <Button
            className={styles.actionBtn}
            theme='secondary'
            onClick={handleCancel}
          >
            取消
          </Button>
          <Button
            className={styles.actionBtn}
            theme='primary'
            disabled={!phoneReady}
            onClick={() => void handleSubmit()}
          >
            提交验证码
          </Button>
        </View>
      </View>
    </View>
  )
}

export default Index
