export const appendElementWithId = (id?: string, content?: any, callbackFn?: () => void) => {
    if (!content || !id) return alert("Something went wrong please contact admin!");
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
    if (!content || !id) return alert("Something went wrong please contact admin!");
    const mainContent = document.getElementById(id);
    localStorage.setItem('previousNode', route);
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
