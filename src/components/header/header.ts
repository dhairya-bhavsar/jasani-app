import {appendElementWithId} from "../../helpers/helper";
export const  HeaderComponent = () => {
    return `
        <h1>JASANI APP</h1>`
}
appendElementWithId('header', HeaderComponent())
