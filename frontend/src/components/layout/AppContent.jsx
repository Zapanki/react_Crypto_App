import { calc } from 'antd/es/theme/internal';
import { Layout, Typography } from 'antd';
import { useCrypto } from '../../context/crypto-context';
import PortfolioChart from '../PortfolioChart';
import AssetsTable from '../AssetTable';

const contentStyle = {
    textAlign: 'center',
    minHeight: 'calc(100vh - 60px)',
    color: '#fff',
    backgroundColor: '#001529',
    padding: '1 rem',
};

export default function AppContent() {
    const { assets, crypto } = useCrypto()

    const cryptoPriceMap = crypto.reduce((acc, c) => {

        acc[c.id] = c.price
        return acc

    }, {})
    return (
        <Layout.Content style={contentStyle}>
            <Typography.Title level={3} style={{ textAlign: 'left', color: 'white' }}>
                Portfolio
            </Typography.Title>
            <PortfolioChart/>
            <AssetsTable/>
        </Layout.Content>
    )
}