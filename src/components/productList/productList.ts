import { appendElementWithId } from "../../helpers/helper";
import * as productData from "../../assets/db/products.json";

export const ProductList = () => {
  const productListDiv = document.createElement("div");
  console.log("aSAsdfsf");
  productListDiv.classList.add("product-listing");
  const { products } = productData;

  const productList = () => {products.map(({ name, sku, image, price }) => {
      console.log(image, "image");
      const item = `
    <div class="single-product" id=${sku}>
    <img class="product-image" src="../../assets/images/bag/back.jpeg"/>
    <p  class="product-name" id="name">${name}</p>
    <p class="product-sku" id="sku" class="sku">${sku}</p>
    <p class="product-price">${price}</p>
     </div>
    `;
      console.log(image, "image");
    productListDiv.appendChild(new DOMParser().parseFromString(item, "text/html").body.firstChild)
    });
  };

  productList();
  console.log(productListDiv, "productListHTML");

  return productListDiv;
};

appendElementWithId("content", ProductList());
