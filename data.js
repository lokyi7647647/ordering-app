export const menuArray = [
  {
    name: "Pizza",
    ingredients: ["pepperoni", "mushrom", "mozarella"],
    id: 0,
    price: 14,
    emoji: "🍕",
    image: "assets/pizza.png",
    imageAlt: "A slice of pepperoni pizza",
  },
  {
    name: "Hamburger",
    ingredients: ["beef", "cheese", "lettuce"],
    price: 12,
    emoji: "🍔",
    id: 1,
    image: "assets/hamburger.png",
    imageAlt:
      "A hamburger with tomato, cheese, patty, and lettuce between two buns",
  },
  {
    name: "Beer",
    ingredients: ["grain, hops, yeast, water"],
    price: 12,
    emoji: "🍺",
    id: 2,
    image: "assets/beer.png",
    imageAlt: "A bear mug filled with beer",
  },
];

export let orderMap = new Map();

export function clearOrderMap() {
  orderMap = new Map();
}
