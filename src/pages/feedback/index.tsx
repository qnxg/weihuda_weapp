import {
  Image,
  Input,
  Navigator,
  Text,
  Textarea,
  View,
} from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { useState } from 'react'
import styles from './index.module.scss'
import { postFeedback } from '@/apis/feedback'
import { uploadImgApi } from '@/apis/upload'
import Button from '@/components/Button'
import type { AddFeedbackReq } from '@/apis/feedback'

const Index: React.FC = () => {
  const { params } = useRouter()
  const noAuth = !!(params.noAuth && params.noAuth == '1')

  // const type_list = [
  //   { label: '产品建议', value: 'suggestion', checked: true },
  //   { label: '功能故障或其他问题', value: 'bug', checked: false }
  // ]

  const [feedbackState, setFeedbackState] = useState<AddFeedbackReq>({
    stuId: '',
    contact: '',
    desc: '',
    imgUrl: undefined,
  })

  // 改变表单的内容
  const change = (key: string, newVal: any) => {
    setFeedbackState({
      ...feedbackState,
      [key]: newVal,
    })
  }

  // 选择图片
  const handleChoose = () => {
    void Taro.chooseImage({
      count: 1,
      success(res) {
        const imgUrl = res.tempFilePaths[0]!
        setFeedbackState({
          ...feedbackState,
          imgUrl,
        })
      },
    })
  }

  // 点击提交按钮
  const handleSubmit = async () => {
    // 验证
    if (
      noAuth &&
      (!feedbackState.stuId || feedbackState.stuId.trim().length === 0)
    ) {
      await Taro.showToast({ title: '请填写学号', icon: 'none' })
      return
    }
    if (
      noAuth &&
      (!feedbackState.contact || feedbackState.contact.trim().length === 0)
    ) {
      await Taro.showToast({ title: '请填写联系方式', icon: 'none' })
      return
    }
    if (feedbackState.desc === '') {
      await Taro.showToast({ title: '请填写反馈内容', icon: 'none' })
      return
    }

    // 上传图片
    if (feedbackState.imgUrl && feedbackState.imgUrl.trim().length > 0) {
      // 如果有图片那就先上传图片，拿到图片地址后再提交表单
      await Taro.showToast({ title: '正在上传图片', icon: 'loading' })
      try {
        const uploadUrl = await uploadImgApi(feedbackState.imgUrl)
        feedbackState.imgUrl = uploadUrl
        await Taro.showToast({ title: '上传图片成功', icon: 'none' })
      } catch {
        await Taro.showToast({ title: '上传图片失败', icon: 'none' })
        return
      }
    }

    await Taro.showLoading({ title: '正在提交' })
    const reqData: AddFeedbackReq = {
      ...feedbackState,
    }
    if (reqData.stuId && reqData.stuId.trim().length === 0)
      reqData.stuId = undefined
    if (reqData.contact && reqData.contact.trim().length === 0)
      reqData.contact = undefined
    if (reqData.imgUrl && reqData.imgUrl.trim().length === 0)
      reqData.imgUrl = undefined
    try {
      await postFeedback(reqData, noAuth)
      await Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1000,
      })
      setTimeout(() => {
        void Taro.redirectTo({ url: '/pages/feedbackHistory/index' })
      }, 1000)
    } catch {
      await Taro.showToast({ title: '提交失败', icon: 'none' })
    }
  }

  return (
    <View className={styles.container}>
      <View className={styles.tips}>
        反馈问题前请先查看
        <View className={styles.feedbackLink}>
          <Navigator url={`/pages/faq/index`} className={'inline'}>
            <Text>常见问题</Text>
          </Navigator>
        </View>
        ，避免重复反馈哦～
      </View>
      {noAuth && (
        <>
          <View className={styles.title} style={{ marginTop: '30px;' }}>
            学号：
          </View>
          <Input
            value={feedbackState.stuId}
            onInput={e => {
              change('stuId', (e.target as any).value)
            }}
            className={styles.input}
            type='text'
            placeholder='请输入学号，必填'
          />
        </>
      )}

      <View className={styles.title} style={{ marginTop: '30px;' }}>
        联系方式：
      </View>
      <Input
        value={feedbackState.contact}
        onInput={e => {
          change('contact', (e.target as any).value)
        }}
        className={styles.input}
        type='text'
        placeholder={`电子邮箱地址，方便接收反馈回复${noAuth ? '，必填' : '，选填'}`}
      />

      <View className={styles.title} style={{ marginTop: '30px;' }}>
        详细描述：
      </View>
      <View className={styles.input}>
        <Textarea
          value={feedbackState.desc}
          onInput={e => {
            change('desc', (e.target as any).value)
          }}
          placeholder='请填写描述信息，必填。'
        />
        <View className={styles.upload}>
          <View className={styles.content}>
            {feedbackState.imgUrl && feedbackState.imgUrl.trim().length > 0 && (
              <View className={styles.image}>
                <Image src={feedbackState.imgUrl}></Image>
              </View>
            )}
            {/* 如果是非登录的用户，不让上传图片 */}
            {!noAuth &&
              !(
                feedbackState.imgUrl && feedbackState.imgUrl.trim().length > 0
              ) && (
                <View className={styles.uploadButton} onClick={handleChoose}>
                  <View className={styles.uploadIcon}></View>
                  <View className={styles.placeholder}>
                    上传图片能帮助程序猿更好地解决问题
                  </View>
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
      {!noAuth && (
        <View className={styles.feedbackLink}>
          <Navigator url={`/pages/feedbackHistory/index`}>
            <Text>反馈历史</Text>
          </Navigator>
        </View>
      )}
    </View>
  )
}

export default Index
