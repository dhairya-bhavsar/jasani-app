import {replaceCurrentElementWithNewId} from "../../helpers/helper";
import {CanvasComponent} from "../canvas/canvas";
import { ProductDetail } from "../productDetail/productDetail";

export function appendComponent(): void {
    document.querySelectorAll('.single-product').forEach((el) => {
        el.addEventListener('click', function replaceDom() {
            console.log("cliked on product ?",el.id);
            replaceCurrentElementWithNewId('content', ProductDetail({id : el.id}), 'productList')
        })
    });
}
