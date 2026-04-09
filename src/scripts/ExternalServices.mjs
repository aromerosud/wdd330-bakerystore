const mealDB = import.meta.env.VITE_MEALDB_URL;
const fakeStore = import.meta.env.VITE_FAKESTORE_URL;
const dummyJson = import.meta.env.VITE_DUMMYJSON_URL;

import { specials } from '../public/data/specials.mjs';


async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

function extractIngredients(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return ingredients;
}

export default class ExternalServices {

  constructor(category) {
    this.category = category;
  }

  async getProductsWithFallback() {
    try {
      const res = await fetch(`${fakeStore}products`);
      if (!res.ok) throw new Error("FakeStore fail");

      const data = await convertToJson(res);
      return data;
    } catch (error) {
      console.warn("FakeStore No Available, use DummyJSON")
    }

    try {
      const res = await fetch(`${dummyJson}products`);
      if (!res.ok) throw new Error("DummyJSON fail");

      const data = await convertToJson(res);
      return data.products;

    } catch (error) {
      console.warn("Both APIs fail");
      return [];
    }
  }

  async getData() {
    switch (this.category) {
      case "cakes":
        return this.getCakes();

      case "desserts":
        return this.getDesserts();

      case "ingredients":
        return this.getIngredients();

      case "specials":
        return this.getSpecials();

      default:
        return [];
    }
  }

  async getCakes() {
    await this.initFakeStore();

    const response = await fetch(`${mealDB}filter.php?c=Dessert`);
    const data = await convertToJson(response);

    return data.meals
      .filter(item => item.strMeal.toLowerCase().includes("cake"))
      .map((item, index) => ({
        Id: item.idMeal,
        Name: item.strMeal,
        Image: item.strMealThumb,
        Price: this.getFakeStorePrice(index),
        Category: "cake"
      }));
  }

  async getDesserts() {
    await this.initFakeStore();

    const response = await fetch(`${mealDB}filter.php?c=Dessert`);
    const data = await convertToJson(response);

    return data.meals.map((item, index) => ({
      Id: item.idMeal,
      Name: item.strMeal,
      Image: item.strMealThumb,
      Price: this.getFakeStorePrice(index),
      Category: "desserts"
    }));
  }

  async getIngredients() {
    await this.initFakeStore();
    const response = await fetch(`${mealDB}list.php?i=list`);
    const data = await convertToJson(response);

    return data.meals.slice(0, 20).map((item, index) => ({
      Id: `ing-${index}`,
      Name: item.strIngredient,
      Image: `https://www.themealdb.com/images/ingredients/${item.strIngredient}.png`,
      Price: this.getFakeStorePrice(index),
      Category: "ingredients"
    }));
  }

  getSpecials() {
    return specials;
  }

  getFakeStorePrice(index) {
    if (!this.fakeProducts) return (Math.random() * 10 + 1).toFixed(2);

    const product = this.fakeProducts[index % this.fakeProducts.length];
    return product.price;
  }

  async initFakeStore() {
    if (!this.products) {
      this.products = await this.getProductsWithFallback();
    }
  }

  async findProductById(id) {
    if (this.category === "specials") {
      return this.findProductByIdFromLocal(id);
    } else {
      return this.findProductByIdFromAPI(id);
    }
  }

  async findProductByIdFromLocal(id) {
    const list = await this.getData();
    return list.find(item => item.Id == id);
  }

  async findProductByIdFromAPI(id) {
    await this.initFakeStore();

    //API theMealDB
    const res = await fetch(`${mealDB}lookup.php?i=${id}`);
    const data = await convertToJson(res);

    const meal = data.meals?.[0];
    if (!meal) return null;

    //Generate index
    const index = parseInt(id) % this.products.length;

    return {
      Id: meal.idMeal,
      Name: meal.strMeal,
      Image: meal.strMealThumb,
      Price: this.getFakeStorePrice(index),
      Description: meal.strInstructions,
      Ingredients: extractIngredients(meal),
      Rating: (Math.random() * 2 + 3).toFixed(1),
      Category: this.category
    };
  }


  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${baseURL}checkout`, options);
    return await convertToJson(response);
  }

}


