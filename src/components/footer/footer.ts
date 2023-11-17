import {appendElementWithId} from "../../helpers/helper";
export const  FooterComponent = () => {
    return `
         <p class="copy_text_bg">&copy; Copyright 2023</p>`
}
appendElementWithId('footer', FooterComponent())
