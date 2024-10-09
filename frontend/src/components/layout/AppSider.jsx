import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Layout, Card, Statistic, List, Typography, Tag } from 'antd';
import { capitalize } from '../../utils';
import { useContext } from 'react';
import CryptoContext from '../../context/crypto-context';

const siderStyle = {
    padding: '1rem',
};

export default function AppSider() {
    const { assets, crypto, portfolioValue } = useContext(CryptoContext);

    // Merging assets with the same coin ID
    const mergedAssets = assets.reduce((acc, asset) => {
        const existingAssetIndex = acc.findIndex(a => a.id === asset.id);
        const marketCoin = crypto.find(c => c.id === asset.id);
        const marketPrice = marketCoin ? marketCoin.current_price : 0;

        if (existingAssetIndex >= 0) {
            // If the coin already exists, update the amount and recalculate total
            acc[existingAssetIndex].amount += asset.amount;
            acc[existingAssetIndex].totalValue += asset.amount * marketPrice;
            acc[existingAssetIndex].price = 
                ((acc[existingAssetIndex].price * acc[existingAssetIndex].amount) + (asset.price * asset.amount)) / 
                (acc[existingAssetIndex].amount + asset.amount);
        } else {
            // If this is a new coin, add it to the list
            acc.push({
                ...asset,
                marketPrice: marketPrice,
                totalValue: asset.amount * marketPrice,
            });
        }

        return acc;
    }, []);

    return (
        <Layout.Sider width="25%" style={siderStyle}>
            <Card style={{ marginBottom: '1rem' }}>
                <Statistic
                    title="Portfolio Value"
                    value={portfolioValue || 0}
                    precision={2}
                    suffix="$"
                />
            </Card>

            {mergedAssets.map(asset => {
                const totalProfit = (asset.marketPrice - asset.price) * asset.amount;
                const grow = asset.marketPrice > asset.price;

                return (
                    <Card key={asset.id} style={{ marginBottom: '1rem' }}>
                        <Statistic
                            title={capitalize(asset.id)}
                            value={isNaN(asset.totalValue) ? 0 : asset.totalValue}
                            precision={2}
                            valueStyle={{ color: grow ? '#3f8600' : '#cf1322' }}
                            prefix={grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            suffix="$"
                        />
                        <List
                            size="small"
                            dataSource={[
                                { title: 'Total Profit', value: totalProfit, withTag: true },
                                { title: 'Asset Amount', value: asset.amount, isPlain: true },
                                { title: 'Market Price', value: asset.marketPrice, isPlain: true },
                            ]}
                            renderItem={(item) => (
                                <List.Item>
                                    <span>{item.title}</span>
                                    <span>
                                        {item.withTag && (
                                            <Tag color={grow ? 'green' : 'red'}>
                                                {((asset.marketPrice - asset.price) / asset.price * 100).toFixed(2)}%
                                            </Tag>
                                        )}
                                        {item.isPlain && item.value}
                                        {!item.isPlain && (
                                            <Typography.Text type={grow ? 'success' : 'danger'}>
                                                {item.value.toFixed(2)}$
                                            </Typography.Text>
                                        )}
                                    </span>
                                </List.Item>
                            )}
                        />
                    </Card>
                );
            })}
        </Layout.Sider>
    );
}
