import React, { Fragment, useState } from 'react'
import HdjwIndex from './components/hdjw'
// 修复编译时css顺序问题：
// eslint-disable-next-line import/order
import CaIndex from './components/ca'
import TabBar from '@/components/TabBar'

const Index: React.FC = () => {
  const [tab, setTab] = useState(0)

  return (
    <Fragment>
      <TabBar
        items={['教务系统', '可信电子凭证']}
        num={0}
        current={tab}
        onClick={setTab}
        className='z-50'
      />
      {tab === 0 ? <HdjwIndex /> : <CaIndex />}
    </Fragment>
  )
}

export default Index
