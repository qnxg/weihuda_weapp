import { getJifenRecordPageApi, postJifenRecordApi } from '@/apis/jifen'
import Button from '@/components/Button'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'

const btnText = {
  loading: '加载中',
  signed: '已签',
  unsigned: '签到'
}

interface IQiandaoProps {
  updateTotal?: () => void
  updateJifenRecord?: () => void
}

const Qiandao: React.FC<IQiandaoProps> = (props) => {
  // 加载，已签到，未签到
  const [status, setStatus] = useState<'loading' | 'unsigned' | 'signed'>('loading')

  const updateTotalAndRecord = () => {
    if (props.updateTotal) {
      props.updateTotal()
    }
    if (props.updateJifenRecord) {
      props.updateJifenRecord()
    }
  }

  // 获取签到状态
  const getData = async () => {
    const res = await getJifenRecordPageApi({
      key: 'qiandao',
      param: dayjs().format('YYYY-MM-DD')
    })
    if (res.rows.length > 0) {
      setStatus('signed')
    } else {
      setStatus('unsigned')
    }
  }

  // 签到
  const handleClick = async () => {
    if (status !== 'unsigned') return
    Taro.showLoading({ title: '签到中' })
    const res = await postJifenRecordApi({
      key: 'qiandao',
      param: dayjs().format('YYYY-MM-DD'),
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    })
    if (res) {
      Taro.showToast({ title: '签到成功' })
      setStatus('signed')
      updateTotalAndRecord()
      return
    }
    Taro.hideLoading()
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <View className={styles.qiandaoCard}>
      <View>今日签到</View>
      <View>
        <Button className={styles.btn} theme={status !== 'unsigned' ? 'default' : 'primary'}
          onClick={handleClick} disabled={status !== 'unsigned'}
        >
          {btnText[status]}
        </Button>
      </View>
    </View>
  )
}

export default Qiandao
