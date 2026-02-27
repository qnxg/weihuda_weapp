import { Block, Button, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from 'react'
import styles from './index.module.scss'
import { postUnbind } from '@/apis/bind'
import { getNoticePageApi } from '@/apis/notice'
import { useUserInfo } from '@/apis/userInfo'
import Copyright from '@/components/Copyright'
import { LineDividedButtonList } from '@/components/LineDividedButtonList'
import usePromise from '@/utils/hooks/usePromise'
import useShowCount from '@/utils/hooks/useShowCount'
import { cleanNotImportantStorage } from '@/utils/storage/storage'

/**
 * 解绑操作
 */
const unBind = async (): Promise<void> => {
  const res = await Taro.showModal({
    title: '确认解绑',
    content: '该学号的所有账号均会被删除',
    confirmColor: '#ff5555',
    cancelColor: '#328ccb',
  })
  if (res.confirm) {
    await Taro.showLoading({
      title: '加载中',
    })
    Taro.clearStorageSync()
    try {
      // 这个操作算是个可有可无的操作。解绑主要还是把本地的 jwt 删掉。
      await postUnbind()
    } catch (err) {
      console.log(err)
    }
    Taro.hideLoading()
    await Taro.reLaunch({
      url: '/pages/bind/index',
    })
  }
}

/**
 * 清除缓存操作
 *
 * 实际上是清除了所有storage，所以本地保存的小程序设置也会被清空。
 */
const clean = async () => {
  const res = await Taro.showModal({
    title: '确认清除',
    content: '清除后将自动返回首页',
    confirmColor: '#ff5555',
    cancelColor: '#328ccb',
  })
  if (res.confirm) {
    cleanNotImportantStorage()
    await Taro.showToast({
      title: '清除成功',
    })
    await Taro.reLaunch({
      url: '/pages/index/index',
    })
  }
}

const nav = (url: string) => () => Taro.navigateTo({ url: url })

/** 操作列表 */
const OptionsList: React.FC<{ messageUnread: number }> = props => (
  <LineDividedButtonList
    items={[
      {
        title: <Text>小程序设置</Text>,
        icon: <View className={styles.setting} />,
        onClick: nav('/settingsPage/index'),
      },
      {
        title: (
          <Text>
            消息盒子
            {props.messageUnread > 0 ? `(${props.messageUnread})` : ''}
          </Text>
        ),
        icon: <View className={styles.message} />,
        onClick: nav('/pages/messageBox/index'),
      },
      {
        title: <Text>积分中心</Text>,
        icon: <View className={styles.jifen} />,
        onClick: nav('/pages/jifen/index'),
      },
      {
        title: <Text>留言板</Text>,
        icon: <View className={styles.messageleft} />,
        onClick: nav('/pages/messageleft/index'),
      },
      {
        title: <Text>更新日志</Text>,
        icon: <View className={styles.changelogImg} />,
        onClick: nav('/pages/changeLog/index'),
      },
      {
        title: <Text>我要反馈</Text>,
        icon: <View className={styles.feedback} />,
        onClick: nav('/pages/feedback/index'),
      },
      {
        title: <Text>常见问题</Text>,
        icon: <View className={styles.faImg} />,
        onClick: nav('/pages/faq/index'),
      },
      {
        title: (
          <Button openType='contact' className={styles.cusBut}>
            人工客服
          </Button>
        ),
        icon: <View className={styles.cusServiceImg} />,
      },
      {
        title: <Text>免责声明</Text>,
        icon: <View className={styles.liabilityImg} />,
        onClick: nav('/pages/noDuty/index'),
      },
      {
        title: <Text>清除缓存</Text>,
        icon: <View className={styles.cleanImg} />,
        onClick: clean,
      },
      {
        title: <Text>解除绑定</Text>,
        icon: <View className={styles.unBindImg} />,
        onClick: unBind,
      },
    ]}
  />
)

const getRecentNoticesUnread = async () =>
  (await getNoticePageApi({ page: 1, pageSize: 20 })).rows.filter(
    item => item.status === 0
  ).length

const Index: React.FC = () => {
  const [userInfo] = useUserInfo([])

  // 用户返回此页时也重新加载
  const pageShowCnt = useShowCount()

  const [unread] = usePromise(getRecentNoticesUnread, 0, [
    getRecentNoticesUnread,
    pageShowCnt,
  ])

  return (
    <Block>
      <View className={styles.outer}>
        <View className={styles.personalInfo}>
          <View className={styles.nickName}>
            {userInfo?.name ?? '湖南大学微生活'}
          </View>
          <View className={styles.nickId}>
            {userInfo?.stuId ?? 'HNU20150415'}
          </View>
        </View>
        <OptionsList messageUnread={unread} />
      </View>
      <View className={styles.version}>
        <View>Version 3.8.8</View>
      </View>
      <Copyright />
    </Block>
  )
}

export default Index
