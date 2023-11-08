export const appendElementWithId = (id?: string, content?: any) => {
    console.log(typeof content,"content")
    if (!content || !id) return alert("Something went wrong please contact admin!");
    const mainContent = document.getElementById(id);
    if (typeof content === "object") mainContent.appendChild(content);
    if (typeof content === "string") mainContent.appendChild(new DOMParser().parseFromString(content, "text/html").body.firstChild);
}
