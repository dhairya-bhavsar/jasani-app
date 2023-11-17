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
        replaceCurrentElementWithNewId('content', routes[previousNode].component,'', routes[previousNode].callbackFunction)
    });
}
