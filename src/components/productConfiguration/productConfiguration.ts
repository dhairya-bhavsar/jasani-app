import * as productData from "../../assets/db/brandings.json";
import {IAvailableTechniques, IBrandingAreas, IProductDetail, IProductInputProps} from "./type";
import {TitleComponent} from "../title/title";
import {images} from "../../assets/images";
import {initialisePopupFunctions, qtyChangeHandel, tabController, techniqueController, initUploadLogoButton} from "./util";
import {addTextHTMLHandler} from "../productDetail/textCustomisationBox";
import {textEditorInitial} from "./productConfigurationController";
import {
    CanvasEditor,
    alignObjectHandler,
    clearCanvasHandler,
    deleteSelectedObjects,
    saveImage,
    alignToolsBtn
} from "./components";
import { qtyProxy } from "../../..";
import 'vanilla-picker/dist/vanilla-picker.csp.css';

const { products } = productData;

export const ProductConfiguration = (props: IProductInputProps): string => {
    // @ts-ignore
    const product: IProductDetail = products.find((product) => product.sku === props.id);
    const defaultSelectedBranding: IBrandingAreas = product?.brandingAreas[0];
    const defaultSelectedTechnique: IAvailableTechniques = product?.brandingAreas[0]?.availableTechniques[0];
    qtyProxy["selectedProduct"] = product;
    qtyProxy["selectedTechnique"] = defaultSelectedTechnique;
    qtyProxy["selectedBrandingArea"] = defaultSelectedBranding;


    setTimeout(() => {
        qtyChangeHandel(defaultSelectedTechnique);
        tabController();
        techniqueController(defaultSelectedBranding, product);
        textEditorInitial();
        deleteSelectedObjects();
        saveImage();
        clearCanvasHandler();
        initUploadLogoButton();
        initialisePopupFunctions();
        alignObjectHandler();
        alignToolsBtn();
    }, 100)

    return `
        <section class="product-detail">
            ${TitleComponent({ title: "Product Listing Page", backNode: true })}
            <section class="product-show">
                <div class="right-side">
                    <div class="product-info">
                        <h2 class="product-name">${product.name}</h2>
                        <p class="product-sku">${product.sku}</p>
                    </div>
                    <div class="canvas-section">
                        ${CanvasEditor(defaultSelectedBranding)}
                        <div class="canvas-actions">
                             <button id="zoomIn" class="inputLabel label_space">
                                <img src="${images['Zoom_in.png']}" alt="${images['Zoom_in.png']}"  class="Zoom_img"/>
                                Zoom in
                             </button>
                             <button id="zoomOut" class="inputLabel">
                                <img src="${images['Zoom_out.png']}" alt="${images['Zoom_out.png']}" class="Zoom_img"/>
                                Zoom out
                             </button>
                             <button id="undo" class="inputLabel">
                                <img src="${images['Undo.png']}" alt="${images['Undo.png']}" class="Undo_img"/>
                                undo
                             </button>
                             <button id="redo" class="inputLabel">
                                <img src="${images['Redo.png']}" alt="${images['Redo.png']}" class="Redo_img"/>
                                redo
                             </button>
                             <button id="downloadFullImage" class="inputLabel">
                                <img src="${images["Save.png"]}" alt="${images["Save.png"]}" class="Save_img"/>
                                save logo for future use
                             </button>
                             <button id="deleteButton" class="inputLabel">
                                <img src="${images['recycle_bin.png']}" alt="${images["Save.png"]}" class="recycle_bin_img"/>
                                Delete
                             </button>
                             <div class="objectAlign hidden">
                                <img src="${images['position.png']}" alt="${images["position.png"]}" class="recycle_bin_img"/>
                                <select id="activeObjAlign">
                                    <option value="align" selected disabled>Align Position</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="center">Center</option>
                                </select>
                             </div>
                        </div>
                    </div>
                </div>
                <div class="left-side">
                    <div class="charge-section">
                        <div class="main_section qty-selection">
                            <p class="font-bold branding-text">Branding charge estimator</p>
                            <div class="text_qty">
                             <label class="text_label">quantity:</label>
                             <input type="number" name="quantity" id="qtySelector" value="1" min="1" class="input_area">
                            </div>
                        </div>
                        <div id="unitCharge">
                        </div>
                    </div>
                    
                    <div class="stepper-section">
                        <div class="card-title">
                            <b>Technique Name:</b> <span id="selectedTechniqueName"> </span>
                        </div> 
                        <div class="tabButtons">
                            <button class="step-button active" name="1">Step 1</button>                       
                            <button class="step-button" name="2">Step 2</button>
                            <button class="step-button" name="3">Step 3</button>
                            <button class="step-button" name="4">Step 4</button>
                        </div>
                        <div id="1" class="tabView tabShow">
                          <p class="font-bold">Choose Branding Area :</p>
                          <div id="available-sections">
                            <div class="image-views">
                                ${product.brandingAreas?.map((item) => {
                                    return `
                                        <div class="section-img-container" id=${item.id}>
                                            <img src=${images[item.path]} alt=${images[item.path]} />
                                            <div>
                                                <span>w: ${item.detail_width} - h: ${item.detail_height}</span>
                                            </div>
                                        </div>`
                                    }).join(" ")
                                }
                            </div>
                          </div>
                          <div class="technique-selector">
                            <p class="font-bold">Choose technique:</p>
                            <div id="techniquesSelection">
                            </div>
                          </div>
                        </div>
                        <div id="2" class="tabView tabHide">
                           <div id="noteMessage" class="bg-warning hidden"></div>
                          <small class="noteSummary">We accept: jpg, jpeg, png, .eps, .pdf or .ai Maximum 10mb file size.</small>
                          <div class="uploadLogo">
                            <p class="font-bold upload_file_center">Upload file (optional)</p>
                            <label for="uploadLogo" class="inputLabel">Upload</label>
                            <input id="uploadLogo" type="file" />
                          </div>
                          <div id="toastMessage"> </div>
                          <div id="colorContainer" class="hidden">
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
                                    <div id="productSummary"> </div>
                        </div>
                        <div class="nextStep">
                        <button id="backStepButton">Back</button>
                          <button id="nextStepButton">Next</button>
                          <button id="saveButton" class="hidden">Save</button>
                        </div>
                    </div>
                    <div class="stepper-actions">
                        <button id="clearCanvas">Discard</button>
                        <button id="openPreviewBtn">Preview</button>
                        <button id="finishBtn">Finish</button>
                    </div>
                </div>
            </section>
        </section>
    `
}


