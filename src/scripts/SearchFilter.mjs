export default class SearchFilter {
  constructor(searchInputSelector, productListRenderer) {
    this.searchInput = document.querySelector(searchInputSelector);
    this.productListRenderer = productListRenderer;
    this.allProducts = [];
    this.debounceTimer = null;
    
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => this.handleSearch(e));
    }
  }

  setProducts(products) {
    this.allProducts = products;
  }

  handleSearch(event) {
    clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(() => {
      const searchTerm = event.target.value.toLowerCase().trim();
      const filteredProducts = this.filterProducts(searchTerm);
      this.productListRenderer(filteredProducts);
    }, 300);
  }

  filterProducts(searchTerm) {
    if (!searchTerm) {
      return this.allProducts;
    }

    return this.allProducts.filter((product) => {
      const name = (product.Name || "").toLowerCase();
      const brand = (product.Brand?.Name || "").toLowerCase();
      const nameWithoutBrand = (product.NameWithoutBrand || "").toLowerCase();
      const description = (product.Description || "").toLowerCase();

      return (
        name.includes(searchTerm) ||
        brand.includes(searchTerm) ||
        nameWithoutBrand.includes(searchTerm) ||
        description.includes(searchTerm)
      );
    });
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = "";
      this.productListRenderer(this.allProducts);
    }
  }

  getSearchTerm() {
    return this.searchInput ? this.searchInput.value.toLowerCase().trim() : "";
  }
}