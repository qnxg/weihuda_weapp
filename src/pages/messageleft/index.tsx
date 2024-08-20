import { IMessageLeft, postMessageLeftApi } from '@/apis/back/messageleft'
import Button from '@/components/Button'
import { useAppSelector } from '@/hooks/redux'
import { Picker, Switch, Text, Textarea, View } from '@tarojs/components'
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
    sendTime: dayjs().format('YYYY-MM-DD'),
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
    let reqData: Partial<IMessageLeft> = {
      isAgree: data.isAgree ? 1 : 0,
      desc: data.desc,
      sendTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      stuId: data.stuId
      // imgUrl: data.imgUrl ? data.imgUrl : null
    }
    try {
      await postMessageLeftApi(reqData)
      Taro.showToast({ title: '提交成功', icon: 'success', duration: 1000 })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    } catch (error) {
      Taro.showToast({ title: '提交失败', icon: 'none' })
    }
  }

  // 点击提交按钮
  const handleSubmit = async () => {
    // 验证
    if (data.desc === '') {
      Taro.showToast({ title: '请填写留言内容', icon: 'none' })
      return
    }

    Taro.showLoading({ title: '正在提交' })
    submitData({
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
          onInput={(e) => {
            change('desc', (e.target as any).value)
          }}
          placeholder='请填写你想留给自己的话，必填。'
        />
      </View>

      {/* 是否选择器 */}
      <View className={styles.title} style={{ marginTop: '30px' }}>
        是否愿意在公众号展示自己的留言：
      </View>
      <View className={styles.ps} >
      ps:公开可获得额外奖励并让心声被更多人听见
      </View>
      <View className={styles.selectorContainer}>
        {/* 选项1 */}
        <View
          className={`${styles.selectorOption} ${data.isAgree ? styles.selected : ''}`}
          onClick={() => change('isAgree', true)}
        >
          公开
        </View>

        {/* 选项2 */}
        <View
          className={`${styles.selectorOption} ${!data.isAgree ? styles.selected : ''}`}
          onClick={() => change('isAgree', false)}
        >
          不公开
        </View>
      </View>
      {/* <Switch
        checked={data.isAgree}
        onChange={(e) => {
          change('isAgree', e.detail.value)
        }}
      /> */}
      <View style={{ marginTop: '30px' }}>
        <Button onClick={handleSubmit} className={styles.submitButton}>
          提交
        </Button>
      </View>
    </View>
  )
}

export default Index
