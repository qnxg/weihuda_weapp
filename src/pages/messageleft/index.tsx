import { IMessageLeft, postMessageLeftApi } from '@/apis/messageleft'
import Button from '@/components/Button'
import { useAppSelector } from '@/utils/hooks/redux'
import { Picker, Radio, RadioGroup, Text, Textarea, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { useState } from 'react'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const { stuId } = useAppSelector((state) => state.userInfo)

  // const type_list = [
  //   { label: '产品建议', value: 'suggestion', checked: true },
  //   { label: '功能故障或其他问题', value: 'bug', checked: false }
  // ]

  const [data, setData] = useState({
    stuId: stuId,
    isAgree: true,
    isSend: false,
    sendTime: dayjs().add(100, 'day').format('YYYY-MM-DD'),
    desc: ''
    // imgUrl: ''
  })

  // 改变表单的内容
  const change = (key, newVal) => {
    setData({
      ...data,
      [key]: newVal
    })
  }

  // 选择图片
  // const handleChoose = () => {
  //   Taro.chooseImage({
  //     count: 1,
  //     success(res) {
  //       const imgUrl = res.tempFilePaths[0]
  //       setData({
  //         ...data,
  //         imgUrl
  //       })
  //     }
  //   })
  // }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const submitData = async (data: any) => {
    // 初始化
    // 获取当前的时分秒
    const currentTime = dayjs().format('HH:mm:ss')

    // 拼接用户选择的日期和当前的时分秒
    const fullDateTime = `${data.sendTime} ${currentTime}`
    let reqData: Partial<IMessageLeft> = {
      isAgree: data.isAgree ? 1 : 0,
      desc: data.desc,
      isSend: data.isSend ? 1 : 0,
      sendTime: fullDateTime, // 格式化用户选择的时间
      stuId: data.stuId
    }
    try {
      await postMessageLeftApi(reqData)
      await Taro.showToast({ title: '提交成功', icon: 'success', duration: 1000 })
      setTimeout(() => {
        void Taro.navigateBack()
      }, 1000)
    } catch (error) {
      await Taro.showToast({ title: '提交失败', icon: 'none' })
    }
  }

  // 点击提交按钮
  const handleSubmit = async () => {
    // 验证
    if (data.desc === '') {
      await Taro.showToast({ title: '请填写留言内容', icon: 'none' })
      return
    }

    await Taro.showLoading({ title: '正在提交' })
    console.log('提交数据', data)
    await submitData({
      ...data
    })
  }

  return (
    <View className={styles.container}>
      {/* 选择留言发送时间 */}
      <View className={styles.title} style={{ marginTop: '30px;' }}>
        选择留言发送时间：
      </View>
      <Picker
        mode='date' // 选择日期
        value={data.sendTime}
        onChange={(e) => {
          console.log('选择的新时间', e.detail.value)
          change('sendTime', e.detail.value)
        }}
      >
        <View className={styles.input}>
          <Text>当前选择时间: {data.sendTime}</Text>
        </View>
      </Picker>
      <View className={styles.title} style={{ marginTop: '30px;' }}>
        时间胶囊：
      </View>
      <View className={styles.input}>
        <Textarea
          value={data.desc}
          maxlength={255}
          onInput={(e) => {
            change('desc', (e.target as any).value)
          }}
          placeholder='请填写你想留给自己的话，必填。'
        />
      </View>
      <View>字数：{data.desc.length}/255</View>
      {/* 是否选择器 */}
      <View className={styles.title} style={{ marginTop: '30px' }}>
        是否愿意在公众号展示自己的留言：
      </View>
      <View className={styles.ps}>ps:公开可获得额外奖励并让心声被更多人听见</View>
      <RadioGroup
        onChange={(e) => {
          const isAgree = e.detail.value === 'true'
          change('isAgree', isAgree)
        }}
      >
        <View className={styles.radioItem}>
          <Radio value='true' checked={data.isAgree}>
            公开
          </Radio>
        </View>
        <View className={styles.radioItem}>
          <Radio value='false' checked={!data.isAgree}>
            不公开
          </Radio>
        </View>
      </RadioGroup>
      <View style={{ marginTop: '30px' }}>
        <Button onClick={handleSubmit} className={styles.submitButton}>
          提交
        </Button>
      </View>
    </View>
  )
}

export default Index
