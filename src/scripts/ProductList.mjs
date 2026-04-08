import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}&category=${product.category || ""}">
        <img src="${product.Image}" alt="${product.Name}">
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
    const list = await this.dataSource.getData(this.category);
    this.products = list;
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
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

  /*async init() {
    const list = await this.dataSource.getData(this.category);

    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list
    );
  }*/
}