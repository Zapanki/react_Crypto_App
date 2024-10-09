import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useCrypto } from '../context/crypto-context';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart() {
    const { assets, crypto } = useCrypto(); // Fetching assets and crypto data from the context
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        // Merging assets with the same ID
        const mergedAssets = assets.reduce((acc, asset) => {
            const existingAssetIndex = acc.findIndex(a => a.id === asset.id);
            const marketCoin = crypto.find(c => c.id === asset.id);
            const marketPrice = marketCoin ? marketCoin.current_price : 0;

            if (existingAssetIndex >= 0) {
                // If the coin already exists, update the amount and total value
                acc[existingAssetIndex].amount += asset.amount;
                acc[existingAssetIndex].totalValue += asset.amount * marketPrice;
            } else {
                // If it's a new coin, add it to the array
                acc.push({
                    ...asset,
                    totalValue: asset.amount * marketPrice,
                });
            }
            return acc;
        }, []);

        // Calculating the total portfolio value for percentage calculation
        const totalPortfolioValue = mergedAssets.reduce((sum, asset) => sum + asset.totalValue, 0);

        // Update the chart data based on the merged assets
        const updatedData = {
            labels: mergedAssets.map((a) => a.name),
            datasets: [
                {
                    label: 'Total Value ($)',
                    data: mergedAssets.map((a) => a.totalValue),
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
                {
                    label: 'Portfolio Percentage (%)',
                    data: mergedAssets.map((a) => ((a.totalValue / totalPortfolioValue) * 100).toFixed(2)),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        setChartData(updatedData);
    }, [assets, crypto]); // Update the chart when assets or crypto data changes

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const asset = chartData.labels[tooltipItem.dataIndex];
                        const totalValue = chartData.datasets[0].data[tooltipItem.dataIndex];
                        const percentage = chartData.datasets[1].data[tooltipItem.dataIndex];
                        return `${asset}: $${totalValue.toFixed(2)} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div style={{
            display: 'flex',
            marginBottom: '1rem',
            justifyContent: 'center',
            height: 400,
        }}>
            <Pie data={chartData} options={options} />
        </div>
    );
}
