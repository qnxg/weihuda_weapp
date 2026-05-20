import { Popup } from '@taroify/core'
import { View, Text } from '@tarojs/components'
import { useMemo, useState } from 'react'
import { FAQS } from './data'
import styles from './index.module.scss'
import { LineDividedButtonList } from '@/components/LineDividedButtonList'
import { Tabs } from '@/components/Tabs'
import type { FaqObject } from './data'

interface FaqPopupProps {
  open: boolean
  onClose: () => void
  faq: FaqObject
}

const FaqPopup: React.FC<FaqPopupProps> = ({ faq, open, onClose }) => {
  return (
    <Popup
      className={styles.faqPopup}
      rounded
      placement='bottom'
      open={open}
      onClose={onClose}
    >
      <Popup.Close />

      <View className={styles.faqPopupTitle}>{faq.q}</View>
      <View className={styles.faqPopupContent}>{faq.a}</View>
    </Popup>
  )
}

const Faq = () => {
  const [selectedFaq, setSelectedFaq] = useState<FaqObject | null>(null)
  const [isPopupVisible, setIsPopupVisible] = useState(false)

  return (
    <View>
      <FaqPopup
        open={isPopupVisible}
        onClose={() => setIsPopupVisible(false)}
        faq={selectedFaq ?? { q: '', a: '' }}
      />

      <Tabs
        loadAll
        defaultPanelIndex={0}
        panels={useMemo(
          () =>
            Object.keys(FAQS).map(category => {
              const faqList = FAQS[category] ?? []

              return {
                title: category,
                component: (
                  <LineDividedButtonList
                    items={faqList.map(faq => ({
                      title: (
                        <Text className={styles.faqListText}>{faq.q}</Text>
                      ),
                      onClick: () => {
                        setSelectedFaq(faq)
                        setIsPopupVisible(true)
                      },
                    }))}
                  />
                ),
              }
            }),
          []
        )}
      />
    </View>
  )
}

export default Faq
