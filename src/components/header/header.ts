import {appendElementWithId} from "../../helpers/helper";
import { getFontData } from "../productConfiguration/util";
export const  HeaderComponent = () => {
    getFontData().then();
    return `
        <h1 class="header-text">JASANI APP</h1>`
}
appendElementWithId('header', HeaderComponent())
