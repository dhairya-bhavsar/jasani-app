import './src/components'
import {replaceCurrentElementWithNewId} from "./src/helpers/helper";
import {routes} from "./src/constant/routes";

export function AddEventBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (!backBtn) return;
    backBtn.addEventListener('click', function GoBack() {
        const previousNode = localStorage.getItem('previousNode')
        if (!previousNode) {
            window.location.reload()
        }
        replaceCurrentElementWithNewId('content', routes[previousNode].component,'', routes[previousNode].callbackFunction);
        qtyProxy["activeTab"] = 1;
    });
}

// @ts-ignore
export let qtyProxy: {
    [key: string]: any
} = new Proxy({}, {
    set (obj, key, value) {
        // Update the property
        obj[key] = value;
        // Find the matching fields in the DOM
        // @ts-ignore
        let fields = document.querySelectorAll(`[name="${key}"]`);
        for (let field of fields) {
            // @ts-ignore
            field.value = value;
        }
        return true;
    }
})
