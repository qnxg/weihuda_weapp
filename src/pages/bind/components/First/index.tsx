import { View, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React from 'react';
import styles from './index.module.scss';
import logo1000 from '@/static/mine/logo.jpg';


interface Props {
  setStep: any;
}

const First: React.FC<Props> = (props) => {
  const nextStep = (): void => {
    void Taro.getUserProfile({
      desc: '授权后可正常使用微生活小程序',
      success: () => {
        props.setStep(2);
      }
    });
  };

  return (
    <View className={styles.footArea}>
      <View className={styles.hintText}>请阅读免责声明并授权微信</View>
      <View className={styles.dealCard}>
        <Image src={logo1000} className={styles.logo} />
        <ScrollView className={styles.textArea} scrollY>
          <View>
            <View className={styles.boldText}>
              为使用微信小程序平台服务，你应当阅读并遵守《微信小程序平台服务条款》。
            </View>
          </View>
          <View>
            <View className={styles.boldText}>一、【协议的范围】</View>
            <View>
              1.1
              本条款是你与腾讯之间关于你使用小程序服务所订立的协议。“用户”是指注册、登录、使用微信小程序的个人或组织。
            </View>
            <View>
              1.2 微信用户使用小程序即成为该小程序的服务用户，微信小程序可以通过小程序平台为相关用户提供应用服务。
            </View>
            <View>
              1.3
              小程序属于微信公众帐号，在不与本条款冲突的情况下，你应遵守《微信公众平台服务协议》等协议规则关于微信公众帐号的其他相关规定。
            </View>
          </View>
          <View>
            <View className={styles.boldText}>二、【小程序注册】</View>
            <View>
              2.1
              你在使用本服务前需要绑定个人信息。微信小程序通过学号、个人门户密码，教务系统密码（研究生为研究生信息管理系统密码）进行绑定注册。
            </View>
            <View>2.2 用户在绑定完成后，方可使用相关功能。</View>
          </View>
          <View>
            <View className={styles.boldText}>三、【小程序使用】</View>
            <View>3.1 本服务信息来源于湖南大学教务系统以及个人门户信息，一切信息以二者为准。</View>
            <View>3.2 本小程序所提供的一切信息仅供参考，不作为任何考核及评定（包括但不限于：评奖评优）的依据。</View>
          </View>
        </ScrollView>
      </View>
      <View className={styles.nextStepBtn} onClick={nextStep}>
        进入下一步并授权
      </View>
    </View>
  );
};

export default First;
