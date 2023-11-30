import {ProductList} from "../components";
import {appendComponent} from "../components/productList/productListController";
export const routes = {
    productList: {
        component: ProductList(),
        callbackFunction: appendComponent
    }
}
