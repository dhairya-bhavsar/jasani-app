import {
    appendElementWithId
} from "../../helpers/helper";
import * as productData from "../../assets/db/products.json";
import {images} from "../../assets/images";
import {TitleComponent} from "../title/title";
import {appendComponent} from "./productListController";

export const ProductList = () => {
    const { products } = productData;

  return `
      <section>
        ${TitleComponent({title: "Product List"})}
        <div class="product-listing" id="product-list">
          ${products.map(({ name, sku, image, price }) => {
            return `
            
            <div class="single-product" id=${sku}>
          
              <img class="product-image main_product_img" alt="${image}" src="${images[image]}"/>
              <p  class="product-name title_center" id="name">${name}</p>
              <p class="product-sku title_center" id="sku" class="sku">${sku}</p>
              <p class="product-price title_center">AED ${price}</p>
            </div>
          `;
        }).join(' ')}
        </div>
      </section>
    `
}
appendElementWithId("content", ProductList(), appendComponent);

