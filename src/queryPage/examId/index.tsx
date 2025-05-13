import { Block, Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useState } from 'react'
import AddPage from './components/addPage'
import ContentLine from './components/contentLine'
import { ModalProvider } from './components/modal'
import Unfinished from './components/unfinished'
import { useDeleteId, useExamId } from './hooks'
import styles from './index.module.scss'
import { ExamId } from './interface'
import TabBar from '@/components/TabBar'
import iconNoCard from '@/static/empty/no-id-card.svg'
import addImg from '@/static/index/add.svg'
import { onColors } from '@/utils/config'

const LOCAL_STORAGE_KEY = 'ExamId-Topping'

const compareUpFn = (a: ExamId, b: ExamId): number => {
  return a.examDate > b.examDate ? 1 : -1
}

const compareDownFn = (a: ExamId, b: ExamId): number => {
  return a.examDate < b.examDate ? 1 : -1
}

const Index: React.FC = () => {
  const [edit, setEdit] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [init, setInit] = useState<boolean>(false)

  // 远端拉取到的数据
  const [examIdList, refreshExamIdList] = useExamId()
  const [runDeleteId] = useDeleteId()

  // 未完成 非置顶的考号
  const [unExamIds, setUnExamIds] = useState<ExamId[]>([])
  // 未完成 置顶的考号
  const [topExamIds, setTopExamIds] = useState<ExamId[]>([])
  // 已完成
  const [pastExamIds, setPastExamIds] = useState<ExamId[]>([])

  useEffect(() => {
    if (examIdList && examIdList.length && examIdList.length > 0) {
      const localData: number[] = Taro.getStorageSync(LOCAL_STORAGE_KEY)
      const tempUnExamIds: ExamId[] = []
      const tempPastExamIds: ExamId[] = []
      const nowDate = dayjs()
      if (localData && typeof localData === 'object' && typeof localData !== 'function') {
        const tempTopExamIds: ExamId[] = []
        examIdList.forEach((value) => {
          if (nowDate.isAfter(dayjs(value.examDate), 'day')) {
            tempPastExamIds.push(value)
          } else {
            if (localData.indexOf(value.keyId) > -1) {
              tempTopExamIds.push(value)
            } else {
              tempUnExamIds.push(value)
            }
          }
        })
        tempTopExamIds.sort(compareUpFn)
        setTopExamIds(tempTopExamIds)
      } else {
        examIdList.forEach((value) => {
          if (nowDate.isAfter(dayjs(value.examDate))) {
            tempPastExamIds.push(value)
          } else {
            tempUnExamIds.push(value)
          }
        })
      }
      tempPastExamIds.sort(compareDownFn)
      tempUnExamIds.sort(compareUpFn)
      setPastExamIds(tempPastExamIds)
      setUnExamIds(tempUnExamIds)
      setInit(true)
    }
  }, [examIdList])

  const onChangeTab = (toTabIndex: number) => {
    setTabIndex(toTabIndex)
  }

  const gotoAddPage = useCallback(() => {
    setEdit(true)
  }, [])

  const addToppingItem = (index: number): void => {
    const addItem = unExamIds.splice(index, 1)
    topExamIds.push(...addItem)
    topExamIds.sort(compareUpFn)
    setTopExamIds([...topExamIds])
    setUnExamIds([...unExamIds])
  }

  const deleteToppingItem = (index: number): void => {
    const addItem = topExamIds.splice(index, 1)
    unExamIds.push(...addItem)
    unExamIds.sort(compareUpFn)
    setTopExamIds([...topExamIds])
    setUnExamIds([...unExamIds])
  }

  const deleteExamItem = async (index: number, type: 'topping' | 'unfinished' | 'finished') => {
    const itemList = type === 'topping' ? topExamIds : type === 'unfinished' ? unExamIds : pastExamIds
    const setItemList = type === 'topping' ? setTopExamIds : type === 'unfinished' ? setUnExamIds : setPastExamIds
    await runDeleteId(itemList[index].keyId, () => {
      itemList.splice(index, 1)
      setItemList([...itemList])
    })
  }

  useEffect(() => {
    if (init) {
      const temp = topExamIds.map((item) => item.keyId)
      Taro.setStorageSync(LOCAL_STORAGE_KEY, temp)
    }
  }, [topExamIds, init])

  return (
    <ModalProvider>
      {edit ? (
        <AddPage
          cancelHandle={() => {
            setEdit(false)
          }}
          confirmHandle={async () => {
            await refreshExamIdList()
            setEdit(false)
          }}
        />
      ) : (
        <Block>
          <TabBar items={['未过期', '已过期']} num={0} current={tabIndex} onClick={onChangeTab} />
          {tabIndex === 0 && unExamIds?.length === 0 && topExamIds?.length === 0 && (
            <View className={styles.empty}>
              <Image className={styles.iconNoCard} src={iconNoCard} />
              <View className={styles.tip}>{tabIndex === 0 ? '点击下面按钮保存我的考号' : '暂无已经完成的考试'}</View>
            </View>
          )}
          {tabIndex === 0 && (
            <Unfinished
              unExamIds={unExamIds}
              topExamIds={topExamIds}
              addTopping={addToppingItem}
              deleteTopping={deleteToppingItem}
              deleteItem={deleteExamItem}
            />
          )}
          {tabIndex === 0 && <Image src={addImg} className={styles.add} onClick={gotoAddPage} />}
          {tabIndex === 1 && pastExamIds?.length === 0 && (
            <View className={styles.empty}>
              <Image className={styles.iconNoCard} src={iconNoCard} />
              <View className={styles.tip}>暂无已经完成的考试</View>
            </View>
          )}
          {tabIndex === 1 &&
            pastExamIds?.map((item, i) => (
              <ContentLine
                key={item.keyId}
                examIdItem={item}
                lineColor={onColors[i % onColors.length]}
                index={i}
                addTopping={addToppingItem}
                deleteTopping={deleteToppingItem}
                deleteItem={deleteExamItem}
                type='finished'
              />
            ))}
        </Block>
      )}
    </ModalProvider>
  )
}

export default Index
