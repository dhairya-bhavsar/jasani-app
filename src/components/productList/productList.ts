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
                <div class="product-thumb">
                    <img alt="${image}" src="${images[image]}"/>
                </div>
                <div class="product-details">
                  <span  class="product-name title_center" id="name">${name}</span>
                  <span class="product-sku title_center" id="sku" class="sku">${sku}</span>
                  <span class="product-price title_center">AED ${price}</span>
                </div>
            </div>
          `;
        }).join(' ')}
        </div>
      </section>
    `
}
appendElementWithId("content", ProductList(), appendComponent);

