import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}&category=${product.Category || ""}">
        <img src="${product.Image}" alt="${product.Name}" loading="lazy" decoding="async">
        <h3 class="card__name">${product.Name}</h3>
        <p class="product-card__price">$${product.Price}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    this.listElement.innerHTML = `<div class="spinner"></div>`;

    const list = await this.dataSource.getData(this.category);
    this.products = list;

    this.listElement.innerHTML = "";

    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }

  getRenderFunction() {
    return (filteredProducts) => this.renderList(filteredProducts);
  }

  getProducts() {
    return this.products;
  }

  sortProducts(criteria) {
    let sorted = [...this.products];

    switch (criteria) {
      case "name-asc":
        sorted.sort((a, b) =>
          a.Name.localeCompare(b.Name)
        );
        break;

      case "name-desc":
        sorted.sort((a, b) =>
          b.Name.localeCompare(a.Name)
        );
        break;

      case "price-asc":
        sorted.sort((a, b) =>
          a.Price - b.Price
        );
        break;

      case "price-desc":
        sorted.sort((a, b) =>
          b.Price - a.Price
        );
        break;
    }

    this.renderList(sorted);
  }

}