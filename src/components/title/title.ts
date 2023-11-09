import {AddEventBackButton} from "../../../index";

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
            ${backNode ? '<button class="btn" id="back-btn">Back</button>': ''}
            ${title}   
         </h1>
    `
}
