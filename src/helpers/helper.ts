import { errorMessages } from "../assets/config";

export const appendElementWithId = (id?: string, content?: any, callbackFn?: () => void) => {
    if (!content || !id) return alert(errorMessages.SERVER_ERROR);
    const mainContent = document.getElementById(id);
    if (typeof content === "object") {
        mainContent.appendChild(content);
        if (callbackFn) callbackFn()
        return
    }
    mainContent.appendChild(new DOMParser().parseFromString(content, "text/html").body.firstChild);
    if (callbackFn) callbackFn()
}

export const replaceCurrentElementWithNewId = (id?: string, content?: any, route?: any, callbackFn?: () => void) => {
    if (!content || !id) return alert(errorMessages.SERVER_ERROR);
    const mainContent = document.getElementById(id);
    if (route) localStorage.setItem('previousNode', route);
    if (typeof content === "object") {
        mainContent.replaceChild(content, mainContent.firstChild)
        if (callbackFn) callbackFn()
        return
    }
    mainContent.replaceChild(new DOMParser().parseFromString(content, "text/html").body.firstChild, mainContent.firstChild)
    if (callbackFn) callbackFn()
}

// export function waitForAddedNode(params) {
//     new MutationObserver(function() {
//         let el = document.getElementById(params.id);
//         if (el) {
//             params.done(el);
//         }
//     }).observe(params.parent || document, {
//         subtree: !!params.recursive || !params.parent,
//         childList: true,
//     });
// }
//
//
// export function routeComponent() {
//     if (!this.id || !this.nextRoute || !this.currentRoute) {
//         return
//     }
//     const mthis = this
//     document.querySelectorAll(this.id).forEach((el) => {
//         el.addEventListener('click', function replaceDom() {
//             replaceCurrentElementWithNewId('content', mthis.nextRoute, mthis.currentRoute)
//         })
//     });
// }



/*
* section : The main container or div in which you need to replace html.
* newContent : new HTML in string
*/
export const replaceInnerChildElements = (section : HTMLElement, newContent : string) =>{
    section.innerHTML = ""
    section.appendChild(new DOMParser().parseFromString(newContent, "text/html").body.firstChild);
}

/*
* id : input box id you want to clear
*/
export const clearInputBoxHandler = (id : string) =>{
    (document.getElementById(id) as HTMLInputElement).value = "";
}


export const setLoader = (isLoading : boolean) => {
    const loader = document.getElementById("loadingSceen");
    loader.style.display = isLoading ? "block" : "none";
};

export function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

export const compareArr = (arr1, arr2) => {
    if(arr1.length !== arr2.length){ return false;}
    return arr1.every((item, index) => item == arr2[index]);
};

export function uniqBy(a, key) {
    // @ts-ignore
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}
