import { AuthQrcodeStatus, getAuthQrcodeStatusApi, putAuthQrcodeStatusApi } from '@/apis/authQrcode'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { Image, Text, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'

const Index: React.FC = () => {
  // 获取query参数
  const { params } = useRouter()
  const code = decodeURIComponent(params?.q!).replace('https://qnxg.cn/mp-qrcode/', '').replace(
    'test0/', ''
  )
  const [status, setStatus] = useState<AuthQrcodeStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getQrCodeStatus = async () => {
    try {
      const res = await getAuthQrcodeStatusApi(code)
      if (res === 'used') {
        setError('二维码已失效')
      } else {
        setStatus(res)
        putAuthQrcodeStatusApi(code, 'using')
      }
    } catch (e) {
      setError('二维码已失效')
    }
  }

  // 获取二维码状态
  useEffect(() => {
    getQrCodeStatus()
  }, [])

  // 回到首页
  const goHome = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  // 确认授权
  const onConfirm = async () => {
    if (!code && status === 'used') return
    await putAuthQrcodeStatusApi(code, 'confirmed')
    setStatus('used')
    Taro.showToast({
      title: '授权成功'
    })
    setTimeout(() => {
      goHome()
    }, 1000)
  }

  // 取消授权
  const onCancel = async () => {
    if (!code && status === 'used') return
    await putAuthQrcodeStatusApi(code, 'canceled')
    setStatus('used')
    Taro.showToast({
      title: '取消成功'
    })
    setTimeout(() => {
      goHome()
    }, 1000)
  }

  return (
    <Card className={styles.container}>
      <View className={styles.logo}>
        <Image src='https://qnxg.cn/mini-logo.svg' />
      </View>
      <Text className={styles.text}>易千工作台</Text>
      {code && status && (
        <View>
          <Button className={classNames(styles.btn, styles.btn1)} onClick={onConfirm}>
            确认授权
          </Button>
          <Button className={classNames(styles.btn, styles.btn2)} theme='default' onClick={onCancel}>
            取消
          </Button>
        </View>
      )}
      {error && (
        <View className={styles.error}>
          <Text>二维码已失效</Text>
          <Button className={classNames(styles.btn, styles.btn2)} theme='default'>
            返回到首页
          </Button>
        </View>
      )}
    </Card>
  )
}

export default Index
