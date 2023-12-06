import { qtyProxy } from "../../../..";
import { fabric } from "fabric";

export function findLogoCordsHelper() {
    console.log(qtyProxy?.selectedBrandArea,"find func helper....");
    if(!qtyProxy?.selectedBrandArea) return;

    const pxTocmH = (px) => (qtyProxy.selectedBrandArea.detail_height * px )/ qtyProxy.selectedBrandArea.height;
    const pxTocmW = (px) => (qtyProxy.selectedBrandArea.detail_width * px )/ qtyProxy.selectedBrandArea.width;

    const drawableArea = qtyProxy.drawableArea;

    const canvasObjects = qtyProxy?.canvas?.getObjects();


    const textObjects = canvasObjects.filter((obj) => obj instanceof fabric.Text);

    const imageObjectsCords = canvasObjects.filter((obj) => obj.type === 'image').map((imgObj) => {
        const logoWidthIncm =  pxTocmW(imgObj.width * imgObj.scaleX);
        const logoHeightIncm =  pxTocmH(imgObj.height * imgObj.scaleY);
        const logoFromLeftInCm =  pxTocmW(imgObj.left - drawableArea.left);
        const logoFromTopIncm = pxTocmH(imgObj.top - drawableArea.top);

        console.log(imgObj.getCoords(),"<<< >>> ??");
        return {id : imgObj.id , cords : [logoWidthIncm,logoHeightIncm,logoFromTopIncm,logoFromLeftInCm]}
    })

    console.log(imageObjectsCords);

    return `
        logoId : 123, cords : [w,h,t,l]
    `
};
