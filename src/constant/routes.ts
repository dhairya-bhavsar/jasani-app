import {ProductList} from "../components";
import {CanvasComponent} from "../components/canvas/canvas";
import {appendComponent} from "../components/productList/productListController";
export const routes = {
    productList: {
        component: ProductList(),
        callbackFunction: appendComponent
    },
    canvas: {
        component: CanvasComponent(),
    }
}
