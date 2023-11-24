import {replaceCurrentElementWithNewId} from "../../helpers/helper";
import {CanvasComponent} from "../canvas/canvas";
import { ProductDetail } from "../productDetail/productDetail";
import {ProductConfiguration} from "../productConfiguration/productConfiguration";

export function appendComponent(): void {
    document.querySelectorAll('.single-product').forEach((el) => {
        el.addEventListener('click', function replaceDom() {
            replaceCurrentElementWithNewId('content', ProductConfiguration({id : el.id}), 'productList')
        })
    });
}
