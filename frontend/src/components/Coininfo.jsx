import React from 'react'
import { Flex, Typography } from 'antd'


export default function Coininfo({coin}){
    return(
        <Flex align='center'>
            <img src={coin.image} alt={coin.name} style={{ width: 40, marginRight: 10 }} />
            <Typography.Title level={2} style={{ margin: 0 }}>{ <span>{(coin.symbol.toUpperCase())}</span>} {coin.name}</Typography.Title>

        </Flex>
    )
}