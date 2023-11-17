import * as productData from "../../assets/db/products.json";
import {
  initialCallHandler,
  initialiseCanvas,
  setBackgroundImg,
  setCustomiseCanvas,
} from "../canvas/canvasController";
import { TitleComponent } from "../title/title";
import { CanvasComponent } from "../canvas/canvas";
import { images } from "../../assets/images";
import { priceCalculator, qtyChangeHandler, selectTechniqueHandler, viewChangeHandler } from "./productDetailController";
import { replaceInnerChildElements } from "../../helpers/helper";
const { products } = productData;

export const ProductDetail = ({ id }) => {
  // @ts-ignore
  const productDetail = products.find((product) => id === product.sku);
  const selectedImgForBG = productDetail.childrenImg[0];
  let selectedTechnique = productDetail.availableTechniques[0];

  /*
  * newTechnique : selected technique
  */
  const setNewImageSections = (newTechnique) => {
    const availableSections = document.getElementById("available-sections");
    const newChild = `
        <div class="image-views">
             ${newTechnique.availableSections
               .map(({ path, id }) => {
                 return `<div class="section-img-container" id=${id}>
                            <img src=${images[path]}/>
                          </div>`;
               })
               .join(" ")}
        </div>
    `;
    replaceInnerChildElements(availableSections,newChild);
  };

  setTimeout(() => {
    const { canvas, productCanvas } = initialiseCanvas(selectedImgForBG);
    initialCallHandler(canvas, productCanvas, selectedImgForBG);
    setCustomiseCanvas(selectedImgForBG);
    setBackgroundImg(productCanvas, images[selectedImgForBG.path]);
    viewChangeHandler(productDetail, productCanvas, canvas);
    selectTechniqueHandler(
      productDetail,
      setNewImageSections,
      productCanvas,
      canvas
    );

    qtyChangeHandler(selectedTechnique.pricing);
    priceCalculator(1,selectedTechnique.pricing);
  }, 0);

  return `
    <section class="product-detail">
        ${TitleComponent({ title: "Product Listing Page", backNode: true })}
        <section class="product-show">
            <div class="product-right-div">
                <div class="product-info">
                    <h2 class="product-name">${productDetail.name}</h2>
                    <p class="product-sku">${productDetail.sku}</p>
                </div>

                <div class="canvas-section">
                    ${CanvasComponent()}

                    <div class="canvas-actions">
                         <button id="zoomIn" class="inputZoomin"><img src="${images['Zoom_in.png']}" class="Zoom_img"/>zoom in</button>
                         <button id="zoomIn" class="inputZoomin"><img src="${images['Zoom_out.png']}" class="Zoom_img"/>zoom out</button>
                         <button id="downloadFullImage" class="inputLabel"><img src="${images['Save.png']}" class="Save_img"/>save logo for future use</button>
                        <button id="deleteButton" class="inputLabel">Delete</button>
                        <button id="downloadImgButton" class="inputLabel">Get Image</button>
                        <button id="getJson" class="inputLabel">Get JSON</button>
                        
                    </div>
                </div>
            </div>

            <div class="product-left-div">

                <div class="charge-section">
                    <div class="main_section qty-selection">
                        <p class="font-bold text_left">Branding charge estimator</p>
                        <div class="text_qty">
                         <label class="text_label">quantity:</label>
                         <input type="number" name="quantity" id="qtySelector" value="1" min="1" class="input_area">
                        </div>
                    </div>
                    <div id="unitCharge">
                    </div>
                </div>

                <div class="stepper-section">
                    <div class="tabButtons">
                        <button class="step-button active" name="1">Step 1</button>                       
                        <button class="step-button" name="2">Step 2</button>
                        <button class="step-button" name="3">Step 3</button>
                        <button class="step-button" name="4">Step 4</button>
                    </div>

                    <div id="1" class="tabView tabShow">

                        <div class="technique-selector">
                            <p class="font-bold">Choose technique:</p>
                            <div class="techniques">
                                ${productDetail?.availableTechniques
                                  .map((el) => {
                                    return `
                                    <div class="technique-option" id=${el.id}>
                                        <div class="technique-option-header">
                                            <p class="font-bold"> ${
                                              el.techniqueName
                                            } </p>
                                        </div>
                                        <div class="technique-option-body">
                                            <p>${
                                              typeof el.maxColor === "number"
                                                ? `Max. ${el.maxColor} color(s)`
                                                : el.maxColor
                                            }</p>
                                            <p>${el.daysRequire} Days</p>
                                        </div>
                                    </div>
                                    `;
                                  })
                                  .join(" ")}
                            </div>
                        </div>

                        <p class="font-bold">Choose Branding Area</p>
                        
                        <div id="available-sections">
                           <div class="image-views">
                                ${selectedTechnique.availableSections
                                  .map(({ path, id }) => {
                                    return `<div class="section-img-container" id=${id}>
                                               <img src=${images[path]}/>
                                             </div>`;
                                  })
                                  .join(" ")}
                           </div>
                        </div>
                    </div>

                    <div id="2" class="tabView tabHide">

                        <div class="uploadLogo">
                            <p class="font-bold upload_file_center">Upload file (optional)</p>
                            <label for="imageInput" class="inputLabel">Upload</label>
                            <input id="imageInput" type="file" />
                        </div>

                    </div>

                    <div id="3" class="tabView tabHide">
                        <p class="font-bold">Add Text (optional)</p>
                        <div class="textInput">
                            <input type="text" id="addedText"/>
                            <button id="applyText">Apply</button>
                        </div>

                        <div>
                            <label for="textColor">Text Color:</label>
                            <input type="color" id="textColor" value="#000000" />
                        </div>

                    </div>

                    <div id="4" class="tabView tabHide">
                        <p class="font-bold">Add Remarks for the Printer (optional)</p>
                        <textarea name="remark" class="remark-text-area" id="remark" cols="3" 
                        placeholder="Please enter remark" rows="3"></textarea>
                    </div>

                    <div class="nextStep">
                        <button id="nextStepButton">Next</button>
                    </div>

                </div>

                <div class="stepper-actions">
                    <button>Discard</button>
                    <button>Preview</button>
                    <button>Finish</button>
                </div>

            </div>
    </section>
    `;
};
