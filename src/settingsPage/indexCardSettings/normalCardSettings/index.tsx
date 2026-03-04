import { Text, View } from '@tarojs/components'
import { useCallback, useEffect, useState } from 'react'
import style from './index.module.scss'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DragSortList from '@/components/DragSortList'
import useShouldRelaunchIndex from '@/utils/hooks/useShouldRelaunchIndex'
import {
  saveCardSettings,
  useFinalCardDisplay,
} from '@/utils/storage/userSettings/customAccessors/computeFinalCardDisplay'
import { DEFAULT_INDEX_NORMAL_CARD_SETTINGS } from '@/utils/storage/userSettings/defaults/indexNormalCardSettings'
import type { CardItem } from '@/components/DragSortList'
import type { CardEnum } from '@/pages/index/CardList/index.config'

/** 小程序常规卡片排序页面  */
const Index: React.FC = () => {
  const [cards, setCards] = useState<CardItem<CardEnum>[]>([])

  const currentSettings = useFinalCardDisplay([])
  useEffect(() => {
    const [enabled, disabled] = currentSettings
    const cardList: CardItem<CardEnum>[] = [
      ...Array.from(enabled).map(key => ({
        key,
        title: key,
        enabled: true,
      })),
      ...Array.from(disabled).map(key => ({
        key,
        title: key,
        enabled: false,
      })),
    ]
    setCards(cardList)
  }, [currentSettings])

  const [canSave, setCanSave] = useState(false)
  const [saving, setSaving] = useState(false)

  const [setShouldRelaunchIndex] = useShouldRelaunchIndex(false)

  const handleToggleCard = useCallback((key: CardEnum) => {
    setCanSave(true)
    setCards(prevCards => {
      const cardIndex = prevCards.findIndex(c => c.key === key)
      if (cardIndex === -1) return prevCards

      const card = prevCards[cardIndex]
      if (!card) return prevCards

      const newEnabled = !card.enabled

      // 创建新数组
      const newCards = [...prevCards]
      newCards.splice(cardIndex, 1)

      // 如果禁用，移到最后；如果启用，移到已启用卡片的最后
      if (newEnabled) {
        // 找到最后一个启用的卡片的位置
        const lastEnabledIndex = newCards.findIndex(c => !c.enabled)
        const insertIndex =
          lastEnabledIndex === -1 ? newCards.length : lastEnabledIndex
        newCards.splice(insertIndex, 0, {
          key: card.key,
          title: card.title,
          enabled: true,
        })
      } else {
        // 移到最后
        newCards.push({ key: card.key, title: card.title, enabled: false })
      }

      return newCards
    })
  }, [])

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    setCanSave(true)
    setCards(prevCards => {
      const newCards = [...prevCards]
      const [movedCard] = newCards.splice(fromIndex, 1)
      if (movedCard) {
        newCards.splice(toIndex, 0, movedCard)
      }
      return newCards
    })
  }, [])

  const handleSave = useCallback(() => {
    void (async () => {
      setSaving(true)
      try {
        const enabled = new Set(cards.filter(c => c.enabled).map(c => c.key))
        const disabled = new Set(cards.filter(c => !c.enabled).map(c => c.key))
        await saveCardSettings(enabled, disabled)
        setCanSave(false)
        setShouldRelaunchIndex(true)
      } finally {
        setSaving(false)
      }
    })()
  }, [cards, setShouldRelaunchIndex])

  const handleCheckAll = useCallback(() => {
    setCanSave(true)
    setCards(prevCards => prevCards.map(card => ({ ...card, enabled: true })))
  }, [])

  const handleUncheckAll = useCallback(() => {
    setCanSave(true)
    setCards(prevCards => prevCards.map(card => ({ ...card, enabled: false })))
  }, [])

  const handleReset = useCallback(() => {
    setCanSave(true)
    const cardList: CardItem<CardEnum>[] = [
      ...Array.from(DEFAULT_INDEX_NORMAL_CARD_SETTINGS.show).map(key => ({
        key,
        title: key,
        enabled: true,
      })),
      ...Array.from(DEFAULT_INDEX_NORMAL_CARD_SETTINGS.dontShow).map(key => ({
        key,
        title: key,
        enabled: false,
      })),
    ]
    setCards(cardList)
  }, [])

  return (
    <>
      <Card>
        <Text className={style.hint}>
          点击序号可切换卡片启用/禁用状态，按住右侧图标拖动调整卡片顺序
        </Text>
      </Card>
      <View className={style.actionButtonsContainer}>
        <Button
          theme='primary'
          disabled={!canSave}
          className={style.actionButton}
          onClick={handleSave}
          loading={saving}
        >
          保存
        </Button>
        <Button
          theme='secondary'
          className={style.actionButton}
          onClick={handleCheckAll}
        >
          全选
        </Button>
        <Button
          theme='secondary'
          className={style.actionButton}
          onClick={handleUncheckAll}
        >
          全不选
        </Button>
        <Button
          theme='secondary'
          className={style.actionButton}
          onClick={handleReset}
        >
          重置为默认
        </Button>
      </View>
      <DragSortList
        cards={cards}
        onToggleCard={handleToggleCard}
        onReorder={handleReorder}
      />
    </>
  )
}

export default Index
