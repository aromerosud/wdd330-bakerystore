import { getLocalStorage, updateCartCount, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();
updateCartCount();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  const listFooter = document.querySelector(".list-footer");
  const cartTotal = document.querySelector(".cart-total");

  productList.innerHTML = "";

  // Cart empty
  if (cartItems.length === 0) {
    productList.innerHTML = "<li>Your cart is empty</li>";
    listFooter.classList.add("hide");
    return;
  }

  // Show footer
  listFooter.classList.remove("hide");

  // Render items
  const htmlItems = cartItems.map(cartItemTemplate);
  productList.innerHTML = htmlItems.join("");

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.Price) * (item.quantity || 1),
    0
  );

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>

      <div class="card__info">
        <a href="../product_pages/index.html?product=${item.Id}">
          <h2 class="card__name">${item.Name}</h2>
        </a>

        <p class="cart-card__quantity">Qty: ${item.quantity || 1}</p>
        <p class="cart-card__price">$${item.Price}</p>
      </div>
    </li>
  `;
}

renderCartContents();