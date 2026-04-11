import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document
    .querySelector("#zip")
    .addEventListener("blur", order.calculateOrderTotal.bind(order));

document.querySelector("#checkoutSubmit").addEventListener("click", async (e) => {
    e.preventDefault();

    const form = document.forms["checkout"];

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const button = e.target;

    // Spinner
    button.disabled = true;
    button.innerHTML = `<span class="spinner-small"></span>`;

    try {
        await order.checkout();
    } catch (err) {
        console.error(err);
        button.disabled = false;
        button.textContent = "Checkout";
    }
});