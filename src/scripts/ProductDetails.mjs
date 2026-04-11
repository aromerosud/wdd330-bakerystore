
import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    const container = document.querySelector(".product-detail");

    // Spinner
    container.insertAdjacentHTML("afterbegin", `<div class="spinner"></div>`);

    this.product = await this.dataSource.findProductById(this.productId);

    const spinner = container.querySelector(".spinner");
    if (spinner) spinner.remove();


    this.renderProductDetails();

    const button = document.getElementById("add-to-cart");

    if (button) {
      button.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];

    const existing = cartItems.find(item => item.Id === this.product.Id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      const productToAdd = {
        ...this.product,
        quantity: 1
      };
      cartItems.push(productToAdd);
    }

    setLocalStorage("so-cart", cartItems);
    updateCartCount();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}


function productDetailsTemplate(product) {

  document.querySelector("#p-name").textContent = product.Name;

  const productImage = document.querySelector("#p-image");
  productImage.src = product.Image;
  productImage.alt = product.Name;

  // Fallback image
  productImage.onerror = () => {
    productImage.src = "/images/cake.svg";
  };

  document.querySelector("#p-price").textContent = `$${product.Price}`;

  document.querySelector("#p-description").textContent =
    product.Description || "No description available";

  // Rating
  const ratingElement = document.querySelector("#p-rating");
  if (ratingElement) {
    ratingElement.textContent = `Rating: ${product.Rating ?? "N/A"} ⭐`;
  }

  // Category
  const categoryElement = document.querySelector("#p-category");
  if (categoryElement) {
    categoryElement.textContent = `Category: ${product.Category}`;
  }

  // Ingredients
  const ingredientsList = document.querySelector("#p-ingredients");
  ingredientsList.innerHTML = "";

  if (product.Ingredients && product.Ingredients.length) {
    product.Ingredients.forEach(ing => {
      const li = document.createElement("li");
      li.textContent = ing;
      ingredientsList.appendChild(li);
    });
  }

  // Button
  document.querySelector("#add-to-cart").dataset.id = product.Id;
}