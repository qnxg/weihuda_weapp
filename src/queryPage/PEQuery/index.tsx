import PullRefresh from '@/components/PullRefresh'
import Tab from '@/components/Tab'
import Panel from '@/components/Tab/components/Panel'
import { Navigator } from '@tarojs/components'
import React from 'react'
import Card from './components/Card'
import HalfCard from './components/HalfCard'
import usePE from './hooks'

// 把对象用&连接起来
const obj2query = (obj: any): string => {
  let res = ''
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      res += `${key}=${obj[key]}&`
    }
  }
  return res.slice(0, -1)
}

const Index: React.FC = () => {
  const { years, current, setCurrent, state, sex, refresh } = usePE()

  const onChangeTab = (index: number): void => {
    setCurrent(index)
  }

  return (
    <Tab items={years} current={current} onChange={onChangeTab}>
      {state.map((item, index) => {
        return (
          <Panel current={current} index={index} key={String(years[index])}>
            <PullRefresh runFunc={refresh} topGap={68}>
              <Card items={item.items} total={item.total} name={item.student.name} sex={sex} />
              {item.items &&
                item.items.map((project) => {
                  return (
                    <HalfCard
                      key={project.name}
                      name={project.name}
                      color={project.class}
                      rank={project.rank}
                      score={project.score}
                    />
                  )
                })}
              <Navigator url={`/queryPage/PEQuery/eye?${obj2query(state[0]?.eye)}`}>
                <HalfCard name='视力' color='white' rank='' score='点击查看' />
              </Navigator>
            </PullRefresh>
          </Panel>
        )
      })}
    </Tab>
  )
}

export default Index
