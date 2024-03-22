import { postUnbind } from '@/apis/back/bind'
import { useAppSelector } from '@/hooks/redux'
import arrow from '@/static/mine/arrow.svg'
import { Block, Button, Image, Navigator, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React from 'react'
import styles from './index.module.scss'

const Index: React.FC = () => {
  const { name: userRealName, stuId: userRealId } = useAppSelector((state) => state.userInfo)

  const postData = async () => {
    return await postUnbind()
  }

  const unBind = async (): Promise<void> => {
    const res = await Taro.showModal({
      title: '确认解绑',
      content: '该学号的所有账号均会被删除',
      confirmColor: '#ff5555',
      cancelColor: '#328ccb'
    })
    if (res.confirm) {
      try {
        await Taro.showLoading({
          title: '加载中'
        })
        await postData()
        Taro.clearStorageSync()
        Taro.hideLoading()
        await Taro.reLaunch({
          url: '/pages/bind/index'
        })
      } catch (err) {
        Taro.hideLoading()
        console.log(err)
      }
    }
  }

  const clean = async () => {
    const res = await Taro.showModal({
      title: '确认清除',
      content: '清除后将自动返回首页',
      confirmColor: '#ff5555',
      cancelColor: '#328ccb'
    })
    if (res.confirm) {
      Taro.clearStorageSync()
      await Taro.showToast({
        title: '清除成功'
      })
      await Taro.reLaunch({
        url: '/pages/index/index'
      })
    }
  }

  return (
    <Block>
      <View className={styles.outer}>
        <View className={styles.personalInfo}>
          <View className={styles.nickName}>{userRealName || '湖南大学微生活'}</View>
          <View className={styles.nickId}>{userRealId || 'HNU20150415'}</View>
        </View>
        <View className={styles.options}>
        <Navigator url='/pages/messageBox/index'>
            <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200}>
              <View className={styles.imgContainer}>
                <View className={styles.message} />
              </View>
              <View className={styles.titleContainer}>
                <View>积分中心</View>
                <Image src={arrow} className={styles.arrow} />
              </View>
            </View>
          </Navigator>
          <View className={styles.divider} />
          <Navigator url='/pages/messageBox/index'>
            <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200}>
              <View className={styles.imgContainer}>
                <View className={styles.message} />
              </View>
              <View className={styles.titleContainer}>
                <View>消息盒子</View>
                <Image src={arrow} className={styles.arrow} />
              </View>
            </View>
          </Navigator>
          <View className={styles.divider} />
          <Navigator url='/pages/feedback/index'>
            <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200}>
              <View className={styles.imgContainer}>
                <View className={styles.feedback} />
              </View>
              <View className={styles.titleContainer}>
                <View>反馈建议</View>
                <Image src={arrow} className={styles.arrow} />
              </View>
            </View>
          </Navigator>
          <View className={styles.divider} />
          <Navigator openType='navigate' url='/pages/faq/index'>
            <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200}>
              <View className={styles.imgContainer}>
                <View className={styles.faImg} />
              </View>
              <View className={styles.titleContainer}>
                <View>帮助中心</View>
                <Image src={arrow} className={styles.arrow} />
              </View>
            </View>
          </Navigator>
          <View className={styles.divider} />
          <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200}>
            <View className={styles.imgContainer}>
              <View className={styles.cusServiceImg} />
            </View>
            <View className={styles.titleContainer}>
              <Button className={styles.cusBut} openType='contact'>
                客服消息
              </Button>
              <Image src={arrow} className={styles.arrow} />
            </View>
          </View>
          <View className={styles.divider} />
          <Navigator openType='navigate' url='/pages/changeLog/index'>
            <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200}>
              <View className={styles.imgContainer}>
                <View className={styles.changelogImg} />
              </View>
              <View className={styles.titleContainer} style={{ borderBottom: 'none' }}>
                <View>更新日志</View>
                <Image src={arrow} className={styles.arrow} />
              </View>
            </View>
          </Navigator>
          <View className={styles.divider} />
          <Navigator openType='navigate' url='/pages/noDuty/index'>
            <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200}>
              <View className={styles.imgContainer}>
                <View className={styles.liabilityImg} />
              </View>
              <View className={styles.titleContainer}>
                <View>免责声明</View>
                <Image src={arrow} className={styles.arrow} />
              </View>
            </View>
          </Navigator>
          <View className={styles.divider} />
          <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200} onClick={clean}>
            <View className={styles.imgContainer}>
              <View className={styles.cleanImg} />
            </View>
            <View className={styles.titleContainer}>
              <View>清除缓存</View>
              <Image src={arrow} className={styles.arrow} />
            </View>
          </View>
          <View className={styles.divider} />
          <View className={styles.optionItem} hoverClass={styles.itemHover} hoverStayTime={200} onClick={unBind}>
            <View className={styles.imgContainer}>
              <View className={styles.unBindImg} />
            </View>
            <View className={styles.titleContainer}>
              <View>解除绑定</View>
              <Image src={arrow} className={styles.arrow} />
            </View>
          </View>
        </View>
      </View>
      <View className={styles.version}>
        <View>Version 3.8.7</View>
      </View>
      <View className={styles.copyright}>
        <View>Copyright © 2017-2024</View>
        <View className={styles.logo1000} />
      </View>
    </Block>
  )
}

export default Index
