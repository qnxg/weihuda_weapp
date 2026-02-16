import React, { Fragment, useState } from 'react'
import NormalLabIndex from './pages/normalLab'
import VirtualLabIndex from './pages/virtualLab'
import TabBar from '@/components/TabBar'

const Index: React.FC = () => {
  const [index, setIndex] = useState(0)

  return (
    <Fragment>
      <TabBar
        items={['普通实验', '虚拟实验']}
        num={0}
        current={index}
        onClick={setIndex}
        className='z-50'
      />
      {index === 0 ? <NormalLabIndex /> : <VirtualLabIndex />}
    </Fragment>
  )
}

export default Index
