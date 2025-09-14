import { Block, View } from '@tarojs/components'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'

interface ModalContext {
  elm: Element | null // 接收modal注入的元素
  showModal: (props: ModalProps) => void
  closeModal: () => void
}

interface ModalProps extends React.PropsWithChildren {
  confirmText: string // 确认按钮的信息
  cancelText: string // 取消按钮的信息
  content: string // 弹窗提示内容
  onConfirm: () => void
  onCancel: () => void
}

const Context = React.createContext<ModalContext>({} as ModalContext)

/**
 * 包装在 ModalProvider 内部的组件，就可以在任意子组件上通过 useShowModal 显示Modal
 */
export const ModalProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const modalRef = useRef<Element | null>(null)
  const [context, setContext] = useState<ModalContext>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalProps, setModalProps] = useState<ModalProps>()

  useEffect(() => {
    setContext({
      elm: modalRef.current,
      showModal: props => {
        setModalProps(props)
        setModalVisible(true)
      },
      closeModal: () => setModalVisible(false),
    })
  }, [])

  return (
    <View className={styles.container}>
      <Context.Provider value={context as ModalContext}>
        {children}
        {modalVisible && <Modal {...(modalProps as ModalProps)} />}
      </Context.Provider>
      <View ref={modalRef} />
    </View>
  )
}

/**
 * 显示弹窗hook
 */
export const useShowModal = () => {
  return useContext(Context).showModal
}

const Modal: React.FC<ModalProps> = props => {
  const {
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    content,
    children,
    ...rest
  } = props
  const { closeModal, elm } = useContext(Context)

  const handleCancel = useCallback(() => {
    onCancel()
    closeModal()
  }, [closeModal, onCancel])

  const handleConfirm = useCallback(() => {
    onConfirm()
    closeModal()
  }, [closeModal, onConfirm])

  return elm
    ? createPortal(
      <Block>
        <View className={styles.overlay} onClick={handleCancel} />
        <View className={styles.dialog} {...rest}>
          {children}
          {content}
          <View className={styles.btnContainer}>
            <View className={styles.cancelBtn} onClick={handleCancel}>
              {cancelText}
            </View>
            <View className={styles.confirmBtn} onClick={handleConfirm}>
              {confirmText}
            </View>
          </View>
        </View>
      </Block>,
      elm
    )
    : null
}
