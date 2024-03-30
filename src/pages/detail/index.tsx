import { getZhihuByIdApi } from '@/apis/zhihu'
import Card from '@/components/Card'
import { RichText, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import dayjs from 'dayjs'
import * as entities from 'entities'
import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'

const regCloseSelf = /\/ *>$/

const fixImgStyle = ' style="" width="" mode="widthFix" show-menu-by-longpress >'
const fixImgStyleClose = ' style="" width="" mode="widthFix" show-menu-by-longpress />'
const regImage = /<img[^>]*>/gi
export const fixImageStyle = (html: string): string => {
  return html.replace(regImage, (match) =>
    regCloseSelf.test(match) ? match.replace(regCloseSelf, fixImgStyleClose) : match.replace(/>$/gi, fixImgStyle)
  )
}

const Index: React.FC = () => {
  const router = useRouter()
  const [title, setTitle] = useState<string>('')
  const [date, setDate] = useState<string | null>('')
  const [content, setContent] = useState('')
  useEffect(() => {
    ;(async () => {
      const { id, title: _title, publishTime } = router.params
      await Taro.setNavigationBarTitle({
        title: _title as string
      })
      setTitle(_title as string)
      setDate(publishTime !== 'null' ? dayjs(publishTime).format('YYYY-MM-DD') : null)
      let res: any = await getZhihuByIdApi(Number(id))
      res = res.content!
      // res = res.replace(/<img/gi, '<img style="position: relative; left: 50%; width: 80%; height: auto"');
      // res = fixImageStyle(res)
      // res = entities.decodeHTML5(res)
      setContent(res)
    })()
  }, [router])

  return (
    <View className={styles.container}>
      <Card className={styles.titleContainer}>
        <View className={styles.title}>{title}</View>
        <View className={styles.extra}>
          {!!date == true ? (
            <View>
              <View className={styles.date} />
              {date}
            </View>
          ) : null}
        </View>
      </Card>
      <Card className={styles.contentContainer}>
        <RichText nodes={content} />
        {/* {content && <View className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />} */}
      </Card>
    </View>
  )
}

export default Index
