import * as productData from "../../assets/db/products.json";
import {IAvailableTechniques, IProductDetail, IProductInputProps} from "./type";
import {TitleComponent} from "../title/title";
import {images} from "../../assets/images";
import {CanvasEditor} from "./components";
import {qtyChangeHandel, tabController} from "./util";
import {techniqueController} from "./util/techniqueController";
import {addTextHTMLHandler} from "../productDetail/textCustomisationBox";
import {textEditorInitial} from "./productConfigurationController";

const { products } = productData;

export const ProductConfiguration = (props: IProductInputProps): string => {
    // @ts-ignore
    const product: IProductDetail = products.find((product) => product.sku === props.id);
    const defaultSelectedTechnique: IAvailableTechniques = product.availableTechniques[0];

    setTimeout(() => {
        qtyChangeHandel(defaultSelectedTechnique);
        tabController();
        techniqueController(defaultSelectedTechnique, product);
        textEditorInitial();
    }, 100)

    return `
        <section class="product-detail">
            ${TitleComponent({ title: "Product Listing Page", backNode: true })}
            <section class="product-show">
                <div class="product-right-div">
                    <div class="product-info">
                        <h2 class="product-name">${product.name}</h2>
                        <p class="product-sku">${product.sku}</p>
                    </div>
                    <div class="canvas-section">
                        ${CanvasEditor(defaultSelectedTechnique)}
                        <div class="canvas-actions">
                             <button id="zoomIn" class="inputLabel label_space">
                                <img src="${images['Zoom_in.png']}" alt="${images['Zoom_in.png']}"  class="Zoom_img"/>
                                Zoom in
                             </button>
                             <button id="zoomOut" class="inputLabel">
                                <img src="${images['Zoom_out.png']}" alt="${images['Zoom_out.png']}" class="Zoom_img"/>
                                Zoom out
                             </button>
                             <button id="downloadFullImage" class="inputLabel">
                                <img src="${images["Save.png"]}" alt="${images["Save.png"]}" class="Save_img"/>
                                save logo for future use
                             </button>
                             <button id="deleteButton" class="inputLabel">
                                <img src="${images['recycle_bin.png']}" alt="${images["Save.png"]}" class="recycle_bin_img"/>
                                Delete
                             </button>
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
                              ${product?.availableTechniques.map((el) => {
                                return `
                                  <div class="technique-option" id=${el.id}>
                                    <div class="technique-option-header">
                                      <p class="font-bold"> ${el.techniqueName} </p>
                                    </div>
                                    <div class="technique-option-body">
                                      <p>${typeof el.maxColor === "number" ? `Max. ${el.maxColor} color(s)` : el.maxColor}</p>
                                      <p>${el.daysRequire} Days</p>
                                    </div>
                                  </div>`}).join(" ")
                                }
                            </div>
                          </div>
                          <p class="font-bold">Choose Branding Area</p>
                          <div id="available-sections">
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
                            <button id="applyText">Add</button>
                          </div>
                          ${addTextHTMLHandler()}
                        </div>
                        <div id="4" class="tabView tabHide">
                          <p class="font-bold">Add Remarks for the Printer (optional)</p>
                          <textarea name="remark" class="remark-text-area" id="remark" cols="3"
                                    placeholder="Please enter remark" rows="3"></textarea>
                        </div>
                        <div class="nextStep">
                          <button id="nextStepButton">Next</button>
                          <button id="saveButton" class="hidden">Save</button>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    `
}


