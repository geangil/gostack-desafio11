import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  formattedValue: string;
  thumbnail_url: string;
  extras: Extra[];
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Food[]>([]);

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      // Load favorite foods from api
      const { data } = await api.get<Food[]>('orders');

      setOrders(
        data
          .map(food => {
            const totalFood = food.price * food.quantity;
            const total = food.extras.reduce(
              (accumulator, { value, quantity }) => {
                return accumulator + value * quantity;
              },
              totalFood,
            );
            return {
              ...food,
              formattedValue: formatValue(total),
            };
          })
          .sort((a: Food, b: Food) => (a.id < b.id ? 1 : -1)),
      );
    }

    loadOrders();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food key={item.id} activeOpacity={0.6}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedValue}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Orders;
