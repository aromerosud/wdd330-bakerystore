import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// Get order ID from URL parameter if available
const params = new URLSearchParams(window.location.search);
const orderId = params.get("orderId");

if (orderId) {
  document.querySelector("#orderId").textContent = `Order ID: ${orderId}`;
}