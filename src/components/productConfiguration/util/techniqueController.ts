import {IAvailableTechniques, IProductDetail} from "../type";
import {images} from "../../../assets/images";
import {replaceCurrentElementWithNewId} from "../../../helpers/helper";
import {qtyChangeHandel} from "./pricingCalculation";
import {qtyProxy} from "../../../../index";
import {canvasConfigurationChangeHandler} from "../components/canvasController";

export function brandingImageRender(tech: IAvailableTechniques) {
    const _html = `
        <div class="image-views">
            ${tech.availableSections.map((item) => {
                return `<div class="section-img-container" id=${item.id}>
                            <img src=${images[item.path]} alt=${images[item.path]} />
                            <div>
                                <span>w: ${item.detail_width} - h: ${item.detail_height}</span>
                            </div>
                        </div>`;
            }).join(" ")}
        </div>`
    replaceCurrentElementWithNewId('available-sections', _html);
    const initSelectedBrandingEl = document.getElementById(tech.availableSections[0].id);
    if (initSelectedBrandingEl) initSelectedBrandingEl.classList.add('active');
    brandImageClickHandler(tech);
    canvasConfigurationChangeHandler(tech.availableSections[0]);
}

export function initialSelectionOfTechnique(defaultSelectedTechnique: IAvailableTechniques) {
    brandingImageRender(defaultSelectedTechnique);
    const initSelectedTechniqueEl = document.getElementById(defaultSelectedTechnique.id);
    if (initSelectedTechniqueEl) initSelectedTechniqueEl.classList.add('active');
}

export function brandImageClickHandler(tech: IAvailableTechniques) {
    // if (!tech) return;
    tech.availableSections.forEach((brand) => {
        const brandEle = document.getElementById(brand.id);
        brandEle.addEventListener('click', (element) => {
            const activeBrand = document.querySelector('.section-img-container.active');
            if (activeBrand) activeBrand.classList.remove('active');
            // @ts-ignore
            const selectedBrand = element.target.closest('.section-img-container');
            if (selectedBrand) selectedBrand.classList.add('active');

           canvasConfigurationChangeHandler(brand);
        });
    });
}

export function assignClickHandlerOnTechnique(product: IProductDetail) {
    if (!product) return;
    product.availableTechniques.forEach((tech) => {
        const techEl = document.getElementById(tech.id);
        techEl.addEventListener('click', (element) => {
            const selectedTechnique = document.querySelector('.technique-option.active');
            if (selectedTechnique) selectedTechnique.classList.remove('active');
            // @ts-ignore
            const currentSelectionEle = element.target.closest('.technique-option');
            currentSelectionEle.classList.add('active');
            brandingImageRender(tech);
            qtyChangeHandel(tech);
        });
    });
}

export function techniqueController(defaultSelectedTechnique: IAvailableTechniques, product: IProductDetail) {
    initialSelectionOfTechnique(defaultSelectedTechnique);
    assignClickHandlerOnTechnique(product);
}
