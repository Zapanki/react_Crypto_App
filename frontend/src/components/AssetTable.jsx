import { Table } from 'antd';
import { useCrypto } from '../context/crypto-context';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        showSorterTooltip: {
            target: 'full-header',
        },
    },
    {
        title: 'Price, $',
        dataIndex: 'currentPrice',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.currentPrice - b.currentPrice,
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.amount - b.amount,
    },
    {
        title: 'Total, $',
        dataIndex: 'total',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.total - b.total,
    }
];

export default function AssetsTable() {
    const { assets, crypto } = useCrypto(); // Fetch both assets and market data

    // Merge assets with the latest price data from the API
    const data = assets.reduce((acc, asset) => {
        const existingAssetIndex = acc.findIndex(a => a.id === asset.id);
        const marketCoin = crypto.find(c => c.id === asset.id);
        const currentPrice = marketCoin ? marketCoin.current_price : asset.price;

        if (existingAssetIndex >= 0) {
            // If the coin already exists, update the amount and average price
            acc[existingAssetIndex].amount += asset.amount;
            acc[existingAssetIndex].total += asset.amount * currentPrice;
            acc[existingAssetIndex].price = 
                ((acc[existingAssetIndex].price * acc[existingAssetIndex].amount) + (asset.price * asset.amount)) / 
                (acc[existingAssetIndex].amount + asset.amount);
        } else {
            // Add a new coin to the list
            acc.push({
                key: asset.id,
                id: asset.id,
                name: asset.name,
                currentPrice: currentPrice,
                amount: asset.amount,
                total: asset.amount * currentPrice,
                price: asset.price
            });
        }

        return acc;
    }, []);

    return (
        <Table
            pagination={false}
            columns={columns}
            dataSource={data}
            showSorterTooltip={{
                target: 'sorter-icon',
            }}
        />
    );
}
