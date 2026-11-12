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
import Faq from './components/Faq'
import styles from './index.module.scss'
import { postFeedback } from '@/apis/feedback'
import { uploadImgApi } from '@/apis/upload'
import Button from '@/components/Button'
import type { AddFeedbackReq } from '@/apis/feedback'

const Index: React.FC = () => {
  // 是否已经提交表单，提交表单后会显示已经提交页面
  const [submitted, setSubmitted] = useState(false)
  const { params } = useRouter()
  const noAuth = !!(params.noAuth && params.noAuth == '1')

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
  const handleSubmit = async (feedback: AddFeedbackReq) => {
    feedback = Object.assign({}, feedback)
    // 验证
    if (noAuth && (!feedback.stuId || feedback.stuId.trim().length === 0)) {
      await Taro.showToast({ title: '请填写学号', icon: 'none' })
      return
    }
    if (noAuth && (!feedback.contact || feedback.contact.trim().length === 0)) {
      await Taro.showToast({ title: '请填写联系方式', icon: 'none' })
      return
    }
    if (feedback.desc === '') {
      await Taro.showToast({ title: '请填写反馈内容', icon: 'none' })
      return
    }

    // 上传图片
    if (feedback.imgUrl && feedback.imgUrl.trim().length > 0) {
      // 如果有图片那就先上传图片，拿到图片地址后再提交表单
      await Taro.showToast({ title: '正在上传图片', icon: 'loading' })
      try {
        const uploadUrl = await uploadImgApi(feedback.imgUrl)
        feedback.imgUrl = uploadUrl
        await Taro.showToast({ title: '上传图片成功', icon: 'none' })
      } catch {
        await Taro.showToast({ title: '上传图片失败', icon: 'none' })
        return
      }
    }

    await Taro.showLoading({ title: '正在提交' })
    const reqData: AddFeedbackReq = {
      ...feedback,
    }
    if (reqData.stuId && reqData.stuId.trim().length === 0)
      reqData.stuId = undefined
    if (reqData.contact && reqData.contact.trim().length === 0)
      reqData.contact = undefined
    if (reqData.imgUrl && reqData.imgUrl.trim().length === 0)
      reqData.imgUrl = undefined
    try {
      await postFeedback(reqData, noAuth)
      setSubmitted(true)
    } catch {
      await Taro.showToast({ title: '提交失败', icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  }

  return (
    <View>
      {submitted ? (
        <View className={styles.successPage}>
          <View className={styles.successHero}>
            <View className={styles.successIcon}>
              <View className={styles.successIconCheck} />
            </View>
            <Text className={styles.successTitle}>反馈提交成功</Text>
            <Text className={styles.successDesc}>
              感谢你的反馈，我们会尽快查看并处理
            </Text>
          </View>

          <View className={styles.successActions}>
            <Button
              className={styles.successActionBtn}
              onClick={() => Taro.navigateBack()}
            >
              完成
            </Button>
          </View>
        </View>
      ) : (
        <View className={styles.container}>
          {noAuth && (
            <>
              <View className={styles.title} style={{ marginTop: '15px;' }}>
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

          <View className={styles.title} style={{ marginTop: '15px;' }}>
            联系方式：
          </View>
          <Input
            value={feedbackState.contact}
            onInput={e => {
              change('contact', (e.target as any).value)
            }}
            className={styles.input}
            type='text'
            placeholder={`请填写QQ号，方便接收反馈回复${noAuth ? '，必填' : '，选填'}`}
          />

          <View className={styles.title} style={{ marginTop: '15px;' }}>
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
                {feedbackState.imgUrl &&
                  feedbackState.imgUrl.trim().length > 0 && (
                    <View className={styles.image}>
                      <Image src={feedbackState.imgUrl}></Image>
                    </View>
                  )}
                {/* 如果是非登录的用户，不让上传图片 */}
                {!noAuth &&
                  !(
                    feedbackState.imgUrl &&
                    feedbackState.imgUrl.trim().length > 0
                  ) && (
                    <View
                      className={styles.uploadButton}
                      onClick={handleChoose}
                    >
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
            <Button
              onClick={() => handleSubmit(feedbackState)}
              className={styles.submitButton}
            >
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

          <View className={styles.faqTip}>
            <Text>常见问题</Text>
          </View>
          <View className={styles.faq}>
            <Faq />
          </View>
        </View>
      )}
    </View>
  )
}

export default Index
