import DisplayCard from '@/components/DisplayCard'
import PullRefresh from '@/components/PullRefresh'
import TabBar from '@/components/TabBar'
import { useAppSelector } from '@/utils/hooks/redux'
import useGraphql from '@/hooks/useGraphql'
import iconNoJK from '@/static/empty/no-exam.svg'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { Fragment, useEffect, useState } from 'react'
import PickerArea from './components/PickerArea'
import styles from './index.module.scss'
import { RootObject } from './interface'

// TODO: 待重构

const Index: React.FC = () => {
  const { semesters, currentSem } = useAppSelector((state) => state.classTable)
  const [show, setShow] = useState(false)
  const [semester, setSemester] = useState(currentSem)
  const [index, setIndex] = useState(0)
  const type = ['主修', '辅修']

  const onChangeFirstTab = (i: number): void => {
    setIndex(i)
  }

  const { data, error, loading, run } = useGraphql<RootObject>({
    operationName: 'choice',
    variables: {
      xn: semesters[semester].xn,
      xq: semesters[semester].xq,
      type: index + 1
    },
    query: `
      query choice($xn: Int!, $xq: Int!, $type: Int!) {
        hdjw {
          choice {
            credit(xn: $xn, xq: $xq, type: $type) {
              zxf
              zxxf
              fxxf
            }
            result(xn: $xn, xq: $xq, type: $type) {
              name
              number
              serial
              status
              school
              credit
              time
              type
              choiceType
            }
          }
        }
      }
      `
  })

  useEffect(() => {
    if (loading) {
      Taro.showLoading({
        title: '加载中...',
        mask: true
      })
    } else {
      Taro.hideLoading()
      if (error) {
        Taro.showToast({
          icon: 'none',
          title: error.toString()
        })
        setShow(false)
      } else if (!data?.data.hdjw.choice || data?.data.hdjw.choice.result.length === 0) {
        setShow(false)
      } else {
        setShow(true)
      }
    }
  }, [loading, error, data])

  const onRefresh = async (close) => {
    await run()
    close()
  }

  return (
    <Fragment>
      <TabBar items={type} num={0} onClick={onChangeFirstTab} current={index} />
      <PullRefresh runFunc={onRefresh} topGap={68}>
        <PickerArea setSemester={setSemester} currentSem={semester} run={run} />
        {show && data?.data?.hdjw.choice.result.length !== 0 ? (
          <View className={styles.outer}>
            <View
              className={styles.totalAmount}
            >{`总学分:${data?.data.hdjw.choice.credit.zxf}, 主修学分:${data?.data.hdjw.choice.credit.zxxf}，辅修学分:${data?.data.hdjw.choice.credit.fxxf}`}</View>
            {data?.data?.hdjw?.choice.result.map((item) => {
              return (
                <DisplayCard title={item.name} subTitle={item.status} footer={item.serial} key={Math.random()}>
                  <View>课程编号：{item.number}</View>
                  <View>方案类别：{item.type}</View>
                  <View>
                    学分/学时：{item.credit}/{item.school}
                  </View>
                  <View>
                    选课方式/时间：{item.choiceType}/{item.time}
                  </View>
                </DisplayCard>
              )
            })}
          </View>
        ) : (
          <View className={styles.container}>
            <Image src={iconNoJK} className={styles.iconNoJK} />
            <View className={styles.text}>暂时没有已选课程</View>
          </View>
        )}
      </PullRefresh>
    </Fragment>
  )
}

export default Index
