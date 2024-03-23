import { FeedbackData, postFeedback } from '@/apis/back/feedback'
import { uploadImgApi } from '@/apis/back/upload'
import Button from '@/components/Button'
import { useAppSelector } from '@/hooks/redux'
import { Image, Input, Navigator, Text, Textarea, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import dayjs from 'dayjs'
import { useState } from 'react'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const { params } = useRouter()
  const noAuth = params.noAuth && params.noAuth == '1'
  const { stuId } = useAppSelector((state) => state.userInfo)

  // const type_list = [
  //   { label: '产品建议', value: 'suggestion', checked: true },
  //   { label: '功能故障或其他问题', value: 'bug', checked: false }
  // ]

  const [data, setData] = useState({
    type: 'suggestion',
    stuId: stuId,
    contact: '',
    desc: '',
    imgUrl: ''
  })

  // 改变表单的内容
  const change = (key, newVal) => {
    setData({
      ...data,
      [key]: newVal
    })
  }

  // 选择图片
  const handleChoose = () => {
    Taro.chooseImage({
      count: 1,
      success(res) {
        const imgUrl = res.tempFilePaths[0]
        setData({
          ...data,
          imgUrl
        })
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const submitData = async (data: any) => {
    // 初始化
    let reqData: Partial<FeedbackData> = {
      type: data.type,
      desc: data.desc,
      contact: data.contact != '' ? data.contact : null,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      stuId: data.stuId === stuId ? data.stuId : stuId + '/' + data.stuId,
      imgUrl: data.imgUrl ? data.imgUrl : null
    }
    try {
      await postFeedback(reqData, !!noAuth)
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
    // 订阅通知
    const subscribeRes = await Taro.requestSubscribeMessage({
      tmplIds: ['FYeNexjH9UgnFYJFhHMJk-KFxKJtEb-3ca8x7A5HYdE']
    })

    // 验证
    if (noAuth && data.stuId === '') {
      Taro.showToast({ title: '请填写学号', icon: 'none' })
      return
    }
    if (data.desc === '') {
      Taro.showToast({ title: '请填写反馈内容', icon: 'none' })
      return
    }

    // 上传图片
    if (data.imgUrl !== '') {
      // 如果有图片那就先上传图片，拿到图片地址后再提交表单
      Taro.showToast({ title: '正在上传图片', icon: 'loading' })
      try {
        const uploadUrl = await uploadImgApi(data.imgUrl)
        data.imgUrl = uploadUrl
        Taro.showToast({ title: '上传图片成功', icon: 'none' })
      } catch (error) {
        Taro.showToast({ title: '上传图片失败', icon: 'none' })
        return
      }
    }
    // 没有选择图片直接提交
    Taro.showLoading({ title: '正在提交' })
    submitData({
      ...data
    })
  }

  return (
    <View className={styles.container}>
      {/* <View className={styles.title}>反馈类型：</View>
      <RadioGroups
        current={data.type}
        onChange={(newVal) => {
          change('type', newVal)
        }}
        style={{ display: 'flex' }}
      >
        {type_list.map((v) => {
          return <Radio style={{ marginRight: '16px' }} key={v.value} label={v.label} value={v.value} />
        })}
      </RadioGroups> */}

      <View className={styles.title} style={{ marginTop: '30px;' }}>
        学号：
      </View>
      <Input
        value={data.stuId}
        onInput={(e) => {
          change('stuId', (e.target as any).value)
        }}
        className={styles.input}
        type='text'
        placeholder='请输入学号'
      />

      {/* <View className={styles.title} style={{ marginTop: '30px;' }}>
        联系方式：
      </View>
      <Input
        value={data.contact}
        onInput={(e) => {
          change('contact', (e.target as any).value)
        }}
        className={styles.input}
        type='text'
        placeholder='请留下QQ或微信号方便我们联系你'
      /> */}

      <View className={styles.title} style={{ marginTop: '30px;' }}>
        详细描述：
      </View>
      <View className={styles.input}>
        <Textarea
          value={data.desc}
          onInput={(e) => {
            change('desc', (e.target as any).value)
          }}
          placeholder='请填写描述信息，必填。'
        />
        <View className={styles.upload}>
          <View className={styles.content}>
            {data.imgUrl !== '' && (
              <View className={styles.image}>
                <Image src={data.imgUrl}></Image>
              </View>
            )}
            {/* 如果是非登录的用户，不让上传图片 */}
            {!noAuth && data.imgUrl === '' && (
              <View className={styles.uploadButton} onClick={handleChoose}>
                <View className={styles.uploadIcon}></View>
                <View className={styles.placeholder}>上传图片能帮助程序猿更好地解决问题</View>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={{ marginTop: '30px' }}>
        <Button onClick={handleSubmit} className={styles.submitButton}>
          提交
        </Button>
      </View>
      <View className={styles.feedbackLink}>
        <Navigator url={`/pages/feedbackHistory/index?stuId=${stuId}`}>
          <Text>反馈历史</Text>
        </Navigator>
      </View>
    </View>
  )
}

export default Index
