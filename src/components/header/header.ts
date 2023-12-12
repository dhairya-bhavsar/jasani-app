import {appendElementWithId} from "../../helpers/helper";
// TODO:: Google font Integration.
// import { getFontData } from "../productConfiguration/util/googleFontIntigration";
export const  HeaderComponent = () => {
    // getFontData().then();
    return `
        <h1 class="header-text">JASANI APP</h1>`
}
appendElementWithId('header', HeaderComponent())
