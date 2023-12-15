import { qtyProxy } from "../../../..";
import {replaceCurrentElementWithNewId} from "../../../helpers/helper";

export function findLogoCordsHelper() {
    if(!qtyProxy?.selectedBrandArea) return;

    const pxTocmH = (px) => (qtyProxy.selectedBrandArea.detail_height * px )/ qtyProxy.selectedBrandArea.height;
    const pxTocmW = (px) => (qtyProxy.selectedBrandArea.detail_width * px )/ qtyProxy.selectedBrandArea.width;

    const drawableArea = qtyProxy.drawableArea;

    const canvasObjects = qtyProxy?.canvas?.getObjects();
    // TODO: text object summary to estimator
    // const textObjects = canvasObjects.filter((obj) => obj instanceof fabric.Text);

    const imageObjectsCords = canvasObjects.filter((obj) => obj.type === 'image').map((imgObj) => {
        const imageObject = qtyProxy?.logoList?.find((el) => el.id == imgObj.id)
        const logoWidthInCm =  Math.ceil(pxTocmW(imgObj.width * imgObj.scaleX));
        const logoHeightInCm =  Math.ceil(pxTocmH(imgObj.height * imgObj.scaleY));
        const logoFromLeftInCm =  Math.ceil(pxTocmW(imgObj.left - drawableArea.left));
        const logoFromTopInCm = Math.ceil(pxTocmH(imgObj.top - drawableArea.top));
        return {
            id : imageObject?.id,
            fileName: imageObject?.imgName,
            imageUrl: imageObject?.imgUrl ,
            cords : [logoWidthInCm,logoHeightInCm,logoFromTopInCm,logoFromLeftInCm]
        }
    });

    let _html = `<div class="product-summary">
                <p>Logo Summary in (cm)</p>   
                <ul class="product-summary-card">
                        <li>No Logo Found!</li>
                    </ul>
                </div>`;

    if (imageObjectsCords && imageObjectsCords.length > 0) {
        _html = `<div class="product-summary">
                <p>Logo Summary in (cm)</p>   
                ${imageObjectsCords?.map((obj) => {
            return `<ul class="product-summary-card">
                        <li><b>Name: </b> ${obj?.fileName}</li>
                        <li><b>Image Url: </b> ${obj?.imageUrl}</li>
                        <li><b>Image Width (cm): </b> ${obj?.cords[0]}</li>
                        <li><b>Image Height (cm): </b> ${obj?.cords[1]}</li>
                    </ul>`
        }).join(" ")}
        </div>`
    }

    replaceCurrentElementWithNewId('productSummary', _html);

    return `
        logoId : 123, cords : [w,h,t,l]
    `
}
