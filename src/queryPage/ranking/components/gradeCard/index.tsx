import { View, Text } from '@tarojs/components'
import DisplayCard from '@/components/DisplayCard'

const getRank = (str?: string) => {
  if (!str) return '无数据'
  const [a, b] = str.split('/')
  if (!b) return '无数据'
  return a
}

const getRankTotal = (str?: string) => {
  if (!str) return null
  const [_, b] = str.split('/')
  if (!b) return null
  return b
}

// 保留两位小数，并去掉多余的 0
const formatDecimal = (num: number) => {
  return parseFloat(num.toFixed(2)).toString()
}

const Item: React.FC<{
  method: '算数' | '加权' | '绩点'
  grade?: string
  rank?: string
}> = props => {
  return (
    <View className='flex'>
      {props.grade && (
        <View className='flex-1'>
          {props.method === '绩点' ? '绩点：' : `${props.method}平均分：`}
          <View className='inline text-primary font-bold text-lg'>
            {props.grade}
          </View>
        </View>
      )}
      {props.rank && (
        <View className='flex-1'>
          {props.grade ? '排名：' : `${props.method}排名：`}
          <View className='inline text-primary font-bold text-lg'>
            {getRank(props.rank)}
          </View>
          {getRankTotal(props.rank) && (
            <>
              <View className='inline text-primary font-bold text-xs'>
                /{getRankTotal(props.rank)}
              </View>
              <View className='inline ml-0.5'>
                (
                {formatDecimal(
                  (Number(getRank(props.rank)) /
                    Number(getRankTotal(props.rank))) *
                    100
                )}
                %)
              </View>
            </>
          )}
        </View>
      )}
    </View>
  )
}

interface Detail {
  arithmetic: string
  weighted: string
  gpa: string
}

interface Props {
  title: string
  grade?: Detail
  rank?: Detail
}

const GradeCard: React.FC<Props> = props => {
  if (!props.grade && !props.rank)
    return (
      <DisplayCard title={props.title}>
        <Text>无数据</Text>
      </DisplayCard>
    )
  return (
    <DisplayCard title={props.title}>
      <Item
        method='算数'
        grade={props.grade?.arithmetic}
        rank={props.rank?.arithmetic}
      />
      <Item
        method='加权'
        grade={props.grade?.weighted}
        rank={props.rank?.weighted}
      />
      <Item method='绩点' grade={props.grade?.gpa} rank={props.rank?.gpa} />
    </DisplayCard>
  )
}

export default GradeCard
