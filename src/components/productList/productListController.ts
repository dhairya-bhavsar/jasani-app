import {replaceCurrentElementWithNewId} from "../../helpers/helper";
import {ProductConfiguration} from "../productConfiguration/productConfiguration";

export function appendComponent(): void {
    document.querySelectorAll('.single-product').forEach((el) => {
        el.addEventListener('click', function replaceDom() {
            replaceCurrentElementWithNewId('content', ProductConfiguration({id : el.id}), 'productList')
        })
    });
}
