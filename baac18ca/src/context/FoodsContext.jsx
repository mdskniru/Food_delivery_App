import { createContext, useContext, useState } from 'react';
import { KEYS, read, write, uid } from '../utils/db';

const FoodsContext = createContext(null);
export const useFoods = () => useContext(FoodsContext);

export function FoodsProvider({ children }) {
  const [foods, setFoods] = useState(() => read(KEYS.foods, []));

  const persist = (next) => {
    setFoods(next);
    write(KEYS.foods, next);
  };

  const addFood = (data) => {
    const food = { id: uid('food'), available: true, ...data };
    persist([...foods, food]);
    return food;
  };

  const updateFood = (id, patch) => {
    persist(foods.map((food) => (food.id === id ? { ...food, ...patch } : food)));
  };

  const deleteFood = (id) => {
    persist(foods.filter((food) => food.id !== id));
  };

  return (
    <FoodsContext.Provider value={{ foods, addFood, updateFood, deleteFood }}>
      {children}
    </FoodsContext.Provider>
  );
}
