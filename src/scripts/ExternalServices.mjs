const mealDB = import.meta.env.VITE_MEALDB_URL;
const fakeStore = import.meta.env.VITE_FAKESTORE_URL;

import { specials } from '../public/data/specials.mjs';

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  async getData(category) {
    switch (category) {
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
    if (!this.fakeProducts) {
      const response = await fetch(`${fakeStore}products`);
      this.fakeProducts = await convertToJson(response);
    }
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
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


