'use client'
import {Tab, Tabs} from '@nextui-org/tabs'
import React from 'react'

import Transactions from './Transactions'

const CoinTab = () => {
  return (
    <Tabs
      aria-label="Options"
      variant="underlined"
      classNames={{
        cursor: "bg-primary w-full",
        base: "border-b-1 border-white/10 w-full",
        tabList: "p-0",
        tab: "p-4 h-auto",
        panel: "p-0"
      }}
    >
      <Tab key="trades" title="TRADES">
        <Transactions />
      </Tab>
    </Tabs>
  )
}

export default CoinTab
