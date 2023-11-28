import {appendElementWithId} from "../../helpers/helper";
export const  FooterComponent = () => {
    return `
         <p>&copy; Copyright 2023</p>`
}
appendElementWithId('footer', FooterComponent())
