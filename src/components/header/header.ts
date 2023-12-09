import {appendElementWithId} from "../../helpers/helper";
import { getFontData } from "../productConfiguration/util/googleFontIntigration";
export const  HeaderComponent = () => {
    getFontData();
    return `
        <h1 class="header-text">JASANI APP</h1>`
}
appendElementWithId('header', HeaderComponent())
