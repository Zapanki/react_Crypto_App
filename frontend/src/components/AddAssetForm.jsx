import { Select, Space, Divider, InputNumber, Button, Form, DatePicker, Result } from "antd";
import { useRef, useState } from "react";
import { useCrypto } from "../context/crypto-context";
import Coininfo from "./Coininfo";

const validateMessages = {
  required: '${label} is required!',
  types: {
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default function AddAssetForm({ onClose }) {
  const [form] = Form.useForm();
  const { crypto, addAsset } = useCrypto();
  const [coin, setCoin] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const assetRef = useRef();

  if (submitted) {
    return (
      <Result
        status="success"
        title="New Asset Added"
        subTitle={`Added ${assetRef.current.amount} of ${coin.name} at ${assetRef.current.price}$ per coin`}
        extra={[
          <Button type="primary" key="console" onClick={onClose}>Close</Button>
        ]}
      />
    );
  }

  const handleCoinChange = (v) => {
    const selectedCoin = crypto.find((c) => c.id === v);
    setCoin(selectedCoin);
    form.setFieldsValue({
      price: selectedCoin.current_price.toFixed(2), // Используем `current_price` для цены
    });
  };

  function onFinish(values) {
    const newAsset = {
      id: coin.id,
      amount: values.amount,
      price: values.price,
      date: values.date ? values.date.toDate() : new Date(),
    };
    assetRef.current = newAsset;
    setSubmitted(true);
    addAsset(newAsset);
  }

  function handleAmountChange(value) {
    const price = form.getFieldValue('price');
    form.setFieldsValue({
      total: +(value * price).toFixed(2),
    });
  }

  function handlePriceChange(value) {
    const amount = form.getFieldValue('amount');
    form.setFieldsValue({
      total: +(amount * value).toFixed(2),
    });
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 10 }}
      style={{ maxWidth: 600 }}
      initialValues={{
        price: coin ? +coin.current_price.toFixed(2) : 0,
      }}
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      {coin && <Coininfo coin={coin} />}
      <Divider />

      <Form.Item>
        <Select
          style={{ width: '100%' }}
          onSelect={handleCoinChange}
          placeholder="Select coin"
          value={coin?.id}
        >
          {crypto.map((coin) => (
            <Select.Option key={coin.id} value={coin.id}>
              <Space>
                <img style={{ width: 20, height: 20 }} src={coin.image} alt={coin.name} /> {coin.name}
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Divider />

      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, type: 'number', min: 0 }]}
      >
        <InputNumber style={{ width: '100%' }} onChange={handleAmountChange} />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
      >
        <InputNumber placeholder="Enter price" onChange={handlePriceChange} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Date & Time"
        name="date"
      >
        <DatePicker showTime />
      </Form.Item>

      <Form.Item
        label="Total"
        name="total"
      >
        <InputNumber disabled style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Add Asset</Button>
      </Form.Item>
    </Form>
  );
}
