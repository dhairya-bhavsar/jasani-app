import {AddEventBackButton} from "../../../index";
import { images } from "../../assets/images";

export type TitleComponentProps = {
    title: string;
    backNode?: boolean;
}
export const  TitleComponent = (props: TitleComponentProps) => {
    const {title, backNode} = props;

    setTimeout(() => {
        if (backNode) AddEventBackButton()
    }, 0)

    return `
         <h1 class="title">
            ${backNode ? `<button class="btn btn-blue" id="back-btn"><img src="${images['left_arrow.png']}" class="arrow_img"/>Go Back</button>`: ''}
            ${title}   
         </h1>
    `
}
