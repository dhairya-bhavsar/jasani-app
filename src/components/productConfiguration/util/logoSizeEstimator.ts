import { qtyProxy } from "../../../..";
import { fabric } from "fabric";
import {replaceCurrentElementWithNewId} from "../../../helpers/helper";

export function findLogoCordsHelper() {
    console.log(qtyProxy?.selectedBrandArea,"find func helper....");
    if(!qtyProxy?.selectedBrandArea) return;

    const pxTocmH = (px) => (qtyProxy.selectedBrandArea.detail_height * px )/ qtyProxy.selectedBrandArea.height;
    const pxTocmW = (px) => (qtyProxy.selectedBrandArea.detail_width * px )/ qtyProxy.selectedBrandArea.width;

    const drawableArea = qtyProxy.drawableArea;

    const canvasObjects = qtyProxy?.canvas?.getObjects();
    console.log("logo", qtyProxy?.canvas?.getObjects());
    // TODO: text object summary get
    // const textObjects = canvasObjects.filter((obj) => obj instanceof fabric.Text);

    const imageObjectsCords = canvasObjects.filter((obj) => obj.type === 'image').map((imgObj) => {
        const logoWidthInCm =  Math.ceil(pxTocmW(imgObj.width * imgObj.scaleX));
        const logoHeightInCm =  Math.ceil(pxTocmH(imgObj.height * imgObj.scaleY));
        const logoFromLeftInCm =  Math.ceil(pxTocmW(imgObj.left - drawableArea.left));
        const logoFromTopInCm = Math.ceil(pxTocmH(imgObj.top - drawableArea.top));

        return {id : imgObj.id , cords : [logoWidthInCm,logoHeightInCm,logoFromTopInCm,logoFromLeftInCm]}
    })

    console.log(imageObjectsCords);

    const _html = `<div class="product-summary">
                <p>Logo Summary in (cm)</p>   
                ${imageObjectsCords?.map((obj) => {
                    return `<ul>
                        <li><span>Image Width (cm): </span> ${obj?.cords[0]}</li>
                        <li><span>Image Height (cm): </span> ${obj?.cords[1]}</li>
                    </ul>`    
                }).join(" ")}
        </div>`

    replaceCurrentElementWithNewId('productSummary', _html);

    return `
        logoId : 123, cords : [w,h,t,l]
    `
}
