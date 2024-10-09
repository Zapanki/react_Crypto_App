import { Flex, Tag, Typography, Divider } from 'antd'
import Coininfo from './Coininfo'


export default function CoinInfoModal({ coin }) {
    return (
        <>
            <Coininfo coin={coin} />
            <Divider />
            <Typography.Paragraph style={{ textAlign: 'center', fontWeight: 'bold' }} >
                <Typography.Text strong>1 day: </Typography.Text>
                <Tag color={coin.price_change_percentage_24h && coin.price_change_percentage_24h > 0 ? 'green' : 'red'}>
                    {coin.price_change_percentage_24h !== 'N/A' ? `${coin.price_change_percentage_24h}%` : 'N/A'}
                </Tag>
            </Typography.Paragraph>
            <Typography.Paragraph>
                <Typography.Text strong>Price: </Typography.Text>
                {coin.current_price ? `${coin.current_price.toFixed(2)}$` : 'N/A'}
            </Typography.Paragraph>
            <Typography.Paragraph>
                <Typography.Text strong>Rank: </Typography.Text>
                {coin.market_cap_rank ? `${coin.market_cap_rank} of 20` : 'N/A'}
            </Typography.Paragraph>
            <Typography.Paragraph>
                <Typography.Text strong>Market Cap: </Typography.Text>
                {coin.market_cap ? `${coin.market_cap.toLocaleString()}$` : 'N/A'}
            </Typography.Paragraph>
        </>
    );
}
