import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import SearchFilter from "./SearchFilter.mjs";

loadHeaderFooter();

// Validation
const validCategories = ["cakes", "desserts", "ingredients", "specials"];
const rawCategory = getParam("category");

const category = validCategories.includes(rawCategory)
  ? rawCategory
  : "cakes";

// Title
function formatCategory(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const titleElement = document.getElementById("category-title");
titleElement.textContent = formatCategory(category);

// Listing
const dataSource = new ExternalServices(category);
const element = document.querySelector(".product-list");

const listing = new ProductList(category, dataSource, element);

listing.init().then(() => {
  const searchFilter = new SearchFilter("#product-search", listing.getRenderFunction());
  searchFilter.setProducts(listing.getProducts());
});

// Sort
const sortSelect = document.getElementById("sortOptions");

sortSelect.addEventListener("change", (e) => {
  listing.sortProducts(e.target.value);
});