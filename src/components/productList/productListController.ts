import {replaceCurrentElementWithNewId} from "../../helpers/helper";
import {CanvasComponent} from "../canvas/canvas";

export function appendComponent(): void {
    document.querySelectorAll('.single-product').forEach((el) => {
        el.addEventListener('click', function replaceDom() {
            replaceCurrentElementWithNewId('content', CanvasComponent(), 'productList')
        })
    });
}
