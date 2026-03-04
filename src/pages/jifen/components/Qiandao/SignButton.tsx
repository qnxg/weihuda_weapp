import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import { getJifenRecordPageApi, postJifenRecordApi } from '@/apis/jifen'
import Button from '@/components/Button'
import useShowCount from '@/utils/hooks/useShowCount'

export const btnText = {
  loading: '加载中',
  signed: '已签',
  unsigned: '签到',
  error: '加载失败',
}

const SignButton: React.FC<{
  className?: string
  signActionCallback?: () => void
}> = props => {
  // 加载，已签到，未签到
  const [status, setStatus] = useState<keyof typeof btnText>('loading')

  const fetchStatus = useCallback(async () => {
    try {
      const res = await getJifenRecordPageApi({
        key: 'qiandao',
        param: dayjs().format('YYYY-MM-DD'),
      })
      if (res.rows.length > 0) {
        return 'signed'
      } else {
        return 'unsigned'
      }
    } catch {
      return 'error'
    }
  }, [])

  // 重显示页面时刷新状态
  const showCnt = useShowCount()
  useEffect(() => {
    void (async () => {
      setStatus(await fetchStatus())
    })()
  }, [fetchStatus, showCnt])

  // 签到
  const handleClick = async () => {
    if (status !== 'unsigned') return
    await Taro.showLoading({ title: '签到中' })
    const res = await postJifenRecordApi({
      key: 'qiandao',
      param: dayjs().format('YYYY-MM-DD'),
    })
    if (res) {
      setStatus('signed')
      if (props.signActionCallback) {
        props.signActionCallback()
      }
      await Taro.showToast({ title: '签到成功' })
      return
    }
    Taro.hideLoading()
  }

  return (
    <Button
      className={props.className}
      theme={status !== 'unsigned' ? 'secondary' : 'primary'}
      onClick={handleClick}
      disabled={status !== 'unsigned'}
      loading={status == 'loading'}
    >
      {btnText[status]}
    </Button>
  )
}

export default SignButton
