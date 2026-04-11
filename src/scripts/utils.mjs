// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

/*
export async function loadHeaderFooter() {

  const headerResponse = await fetch("../partials/header.html");
  const footerResponse = await fetch("../partials/footer.html");

  const headerHTML = await headerResponse.text();
  const footerHTML = await footerResponse.text();

  const header = document.querySelector("#header");
  const footer = document.querySelector("#footer");

  renderWithTemplate(headerHTML, header);
  renderWithTemplate(footerHTML, footer);
  
}*/

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#header");
  const footerElement = document.querySelector("#footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  updateCartCount();
}

//Add a superscript number of items
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const countElement = qs(".cart-count");

  if (!countElement) return;

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  if (totalItems > 0) {
    countElement.textContent = totalItems;
    countElement.style.display = "flex";
  } else {
    countElement.style.display = "none";
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export function alertMessage(message, scroll = true, type = 'error') {
  // Remove any existing alerts first
  const existingAlert = document.querySelector('.alert-message');
  if (existingAlert) {
    existingAlert.remove();


  }

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert-message alert-${type}`;

  let messageContent = '';

  if (typeof message === 'object') {
    messageContent = '<ul>';
    Object.entries(message).forEach(([key, value]) => {
      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
      messageContent += `<li><strong>${fieldName}:</strong> ${value}</li>`;
    });
    messageContent += '</ul>';
  } else {
    messageContent = `<p>${message}</p>`;
  }

  alertDiv.innerHTML = `
    <div class="alert-content">
      ${messageContent}
      <button class="alert-close" type="button" aria-label="Close alert">&times;</button>
    </div>
  `;

  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.insertAdjacentElement('afterbegin', alertDiv);
  }

  alertDiv.querySelector('.alert-close').addEventListener('click', () => {
    alertDiv.remove();
  });

  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  const alertmess = document.querySelector(".alert-message");

  setTimeout(() => {
    alertmess.style.opacity = "0";
    setTimeout(() => alertmess.remove(), 300);
  }, 2700);

}