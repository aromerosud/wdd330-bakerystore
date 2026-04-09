import { getParam, updateCartCount, loadHeaderFooter} from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
const category = getParam("category");
const dataSource = new ExternalServices(category);
const product = new ProductDetails(productId, dataSource);
product.init();

updateCartCount();

