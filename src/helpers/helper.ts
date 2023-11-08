export const appendElementWithId = (id?: string, content?: any) => {
    if (!content || !id) return alert("Something went wrong please contact admin!");
    const mainContent = document.getElementById(id);
    mainContent.appendChild(new DOMParser().parseFromString(content, "text/html").body.firstChild);
}
