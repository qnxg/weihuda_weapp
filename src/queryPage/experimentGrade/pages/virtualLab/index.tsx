import NoData from '@/components/NoData'

const VirtualLabIndex: React.FC = () => {
  // const [grade, setGrade] = useState<VirtualLabGrade[]>([])
  // const getData = async () => {
  //   await Taro.showLoading({
  //     mask: true,
  //     title: '加载中...',
  //   })
  //   try {
  //     const res = await getVirtualLabGrade()
  //     if (!res) {
  //       Taro.hideLoading()
  //       await Taro.navigateTo({
  //         url: '/settingsPage/labBindSettings/index?tips=true',
  //       })
  //       return
  //     }
  //     setGrade(res)
  //   } catch (err) {
  //     await Taro.showToast({
  //       icon: 'none',
  //       title: err.toString(),
  //     })
  //   }
  //   Taro.hideLoading()
  // }
  // const onRefresh = async (close: () => void) => {
  //   await getData()
  //   close()
  // }
  // useEffect(() => {
  //   void getData()
  // }, [])
  return <NoData text='该功能已下线' />
}

export default VirtualLabIndex
