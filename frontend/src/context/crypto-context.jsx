import { createContext, useState, useEffect, useContext } from "react";
import { fetchCryptoFromAPI, fetchAssets } from "../api";
import { percentDifference } from "../utils";

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
});

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0); // Добавляем состояние для общего значения портфолио

  function mapAssets(assets, result) {
    const totalPortfolioValue = assets.reduce((acc, asset) => {
      const coin = result.find((c) => c.id === asset.id);
      if (!coin) return acc;
      return acc + asset.amount * coin.current_price; // Используем актуальную цену с API
    }, 0);

    setPortfolioValue(totalPortfolioValue); // Обновляем общую стоимость портфолио

    return assets.map((asset) => {
      const coin = result.find((c) => c.id === asset.id);
      if (!coin) {
        return {
          ...asset,
          name: 'Unknown',
          grow: false,
          growPercent: 0,
          procentsPerEachCoin: 0,
          totalAmount: 0,
          totalProfit: 0,
        };
      }

      const totalValue = asset.amount * coin.current_price;
      return {
        grow: asset.price < coin.current_price,
        growPercent: percentDifference(asset.price, coin.current_price),
        procentsPerEachCoin: ((totalValue / totalPortfolioValue) * 100).toFixed(2),
        totalAmount: totalValue,
        totalProfit: (coin.current_price - asset.price) * asset.amount,
        name: coin.name,
        ...asset,
      };
    });
  }

  useEffect(() => {
    async function preload() {
      setLoading(true);
      const result = await fetchCryptoFromAPI(); // Получаем данные о монетах с API
      const assets = await fetchAssets(); // Загружаем данные об активах пользователя

      setAssets(mapAssets(assets, result)); // Карта активов
      setCrypto(result);
      setLoading(false);
    }
    preload();
  }, []);

  function addAsset(newAsset) {
    setAssets((prev) => mapAssets([...prev, newAsset], crypto));
  }

  return (
    <CryptoContext.Provider value={{ loading, crypto, assets, portfolioValue, addAsset }}>
      {children}
    </CryptoContext.Provider>
  );
}

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
