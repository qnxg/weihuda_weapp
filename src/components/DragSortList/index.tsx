import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useRef, useCallback } from 'react'
import styles from './index.module.scss'
import type { Key } from 'react'

export interface CardItem<K extends Key = Key> {
  key: K
  title: string
  enabled: boolean
}

interface DragSortListProps<K extends Key> {
  cards: CardItem<K>[]
  onToggleCard: (key: K) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

const CARD_HEIGHT = 90 // 固定卡片高度
const CARD_GAP = 16 // 卡片间距

function DragSortList<K extends Key>(props: DragSortListProps<K>) {
  const { cards, onToggleCard, onReorder } = props

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const dragStartY = useRef(0)
  const containerRef = useRef<any>(null)

  // 计算总高度
  const totalHeight = cards.length * (CARD_HEIGHT + CARD_GAP)

  // 处理拖拽开始
  const handleDragStart = useCallback((index: number, e: any) => {
    e.stopPropagation()
    const touch = e.touches?.[0]
    if (!touch) return

    dragStartY.current = touch.clientY
    setDraggingIndex(index)
    setDragOffset(0)
  }, [])

  // 处理拖拽移动
  const handleDragMove = useCallback(
    (index: number, e: any) => {
      if (draggingIndex !== index) return

      e.stopPropagation()
      const touch = e.touches?.[0]
      if (!touch) return

      const deltaY = touch.clientY - dragStartY.current
      setDragOffset(deltaY)

      // 计算目标位置
      const currentTop = index * (CARD_HEIGHT + CARD_GAP) + deltaY
      let targetIndex = Math.round(currentTop / (CARD_HEIGHT + CARD_GAP))
      targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex))

      // 如果位置变化，更新顺序
      if (targetIndex !== index) {
        onReorder(index, targetIndex)
        dragStartY.current = touch.clientY
        setDragOffset(0)
        setDraggingIndex(targetIndex)
      }
    },
    [draggingIndex, cards.length, onReorder]
  )

  // 处理拖拽结束
  const handleDragEnd = useCallback(
    (index: number, e: any) => {
      if (draggingIndex !== index) return
      e.stopPropagation()
      setDraggingIndex(null)
      setDragOffset(0)
    },
    [draggingIndex]
  )

  // 计算卡片位置
  const getCardTop = (index: number) => {
    if (draggingIndex === null) {
      return index * (CARD_HEIGHT + CARD_GAP)
    }

    // 正在拖拽的卡片
    if (index === draggingIndex) {
      return index * (CARD_HEIGHT + CARD_GAP) + dragOffset
    }

    // 其他卡片保持在正常位置
    return index * (CARD_HEIGHT + CARD_GAP)
  }

  return (
    <View
      className={styles.container}
      style={{ height: Taro.pxTransform(totalHeight) }}
      ref={containerRef}
    >
      {cards.map((card, index) => {
        const top = getCardTop(index)
        const isDragging = draggingIndex === index
        const isEnabled = card.enabled

        return (
          <View
            key={String(card.key)}
            className={`${styles.cardWrapper} ${isDragging ? styles.dragging : ''}`}
            style={{
              top: Taro.pxTransform(top),
              zIndex: isDragging ? 1000 : 1,
            }}
          >
            <View className={styles.cardInner}>
              <View className={styles.cardContent}>
                {/* 序号按钮 */}
                <View
                  className={`${styles.numberButton} ${!isEnabled ? styles.disabled : ''}`}
                  onClick={() => onToggleCard(card.key)}
                >
                  {index + 1}
                </View>

                {/* 标题 */}
                <View
                  className={`${styles.title} ${!isEnabled ? styles.titleDisabled : ''}`}
                >
                  {card.title}
                </View>

                {/* 拖拽按钮 (汉堡图标) */}
                <View
                  className={styles.dragHandle}
                  onTouchStart={e => handleDragStart(index, e)}
                  onTouchMove={e => handleDragMove(index, e)}
                  onTouchEnd={e => handleDragEnd(index, e)}
                  onTouchCancel={e => handleDragEnd(index, e)}
                >
                  <View className={styles.hamburger}>
                    <View className={styles.line} />
                    <View className={styles.line} />
                    <View className={styles.line} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default DragSortList
