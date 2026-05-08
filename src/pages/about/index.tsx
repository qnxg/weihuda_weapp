import { View } from '@tarojs/components'
import React, { useMemo } from 'react'
import styles from './index.module.scss'
import Card from '@/components/Card'
import licenses from '@/static/licenses/report.json'

interface LicenseReportItem {
  name: string
  licenseType: string | null
  link: string | null
  installedVersion: string
  author: string | null
}

function processLicenses() {
  try {
    const licensesCopied: LicenseReportItem[] = []

    // 浅层拷贝
    for (const license of licenses) {
      const copied = Object.assign({}, license) as LicenseReportItem

      // 处理可能的 n/a 值，以 null 替换
      copied.licenseType =
        copied.licenseType === 'n/a' ? null : copied.licenseType
      copied.link = copied.link === 'n/a' ? null : copied.link
      copied.author = copied.author === 'n/a' ? null : copied.author

      licensesCopied.push(copied)
    }

    return licensesCopied.sort()
  } catch (e) {
    console.error('无法解析库列表', e)
    return null
  }
}

const About: React.FC = () => {
  const licenses = useMemo(() => processLicenses(), [])

  const licenseUiItems = licenses?.map((lib, i) => (
    <>
      <View key={lib.name} className={styles.libraryItem}>
        <View>{lib.name}</View>
        {lib.author && (
          <View className={styles.detailsLabel}>{lib.author}</View>
        )}
        <View className={styles.detailsLabel}>
          {lib.licenseType ?? '非开源协议'} · {lib.installedVersion}
        </View>
      </View>
      {i < licenses.length - 1 && <View className={styles.divider}></View>}
    </>
  )) ?? (
    <View>
      <View className={styles.libraryItem}>
        <View>无法获取库列表</View>
      </View>
    </View>
  )

  return (
    <View>
      <Card>
        <View style={{ fontWeight: 'bold' }}>简介</View>
        <View className='mt-2'>
          湖南大学微生活小程序由湖南大学易千网络文化工作室开发。
        </View>
        <View className='mt-3'>
          易千网络文化工作室隶属于湖南大学党委学生工作部，由湖大学在校学生组成。秉持“遵循本心、自我驱动、无限创造”的价值理念，自主开发和运营以学生为用户群的网络产品，帮助湖大师生更好地生活、学习、工作、娱乐，简称易千。
        </View>
        <View className='mt-3'>GitHub：https://github.com/qnxg</View>
      </Card>

      <Card>
        <View style={{ fontWeight: 'bold' }}>使用的开源组件</View>

        {licenseUiItems}
      </Card>
    </View>
  )
}

export default About
