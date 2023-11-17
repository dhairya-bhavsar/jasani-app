import {appendElementWithId} from "../../helpers/helper";
export const  HeaderComponent = () => {
    return `
        <h1 class="text_margin">JASANI APP</h1>`
}
appendElementWithId('header', HeaderComponent())
