import {IAvailableTechniques, IBrandingAreas, IProductDetail} from "../type";
import {replaceCurrentElementWithNewId} from "../../../helpers/helper";
import {qtyChangeHandel} from "./pricingCalculation";
import {canvasConfigurationChangeHandler} from "../components";
import {qtyProxy} from "../../../../index";

export function techniqueRender(tech: IBrandingAreas, id = "techniquesSelection") {
    const _html = `
        <div class="techniques">
            ${tech?.availableTechniques.map((el) => {
                return `
                      <div class="technique-option" id=${el.id}>
                        <div class="technique-option-header">
                            <p class="font-bold"> ${el.techniqueName} </p>
                        </div>
                        <div class="technique-option-body">
                            <p>${typeof el.maxColor === "number" ? `Max. ${el.maxColor} color(s)` : el.maxColor}</p>
                            <p>${el.daysRequire} Days</p>
                        </div>
                      </div>`
            }).join(" ")}
        </div>`
    replaceCurrentElementWithNewId(id, _html);
    const initSelectedBrandingEl = document.getElementById(tech.availableTechniques[0].id);
    if (initSelectedBrandingEl) initSelectedBrandingEl.classList.add('active');
    document.getElementById('selectedTechniqueName').innerHTML = tech.availableTechniques[0].techniqueName;
    techniqueClickHandler(tech?.availableTechniques);
    canvasConfigurationChangeHandler(tech);
}

export function initialSelectionOfBrandingArea(defaultSelectedBrandArea: IBrandingAreas) {
    techniqueRender(defaultSelectedBrandArea);
    const initSelectedTechniqueEl = document.getElementById(defaultSelectedBrandArea.id);
    if (initSelectedTechniqueEl) initSelectedTechniqueEl.classList.add('active');
}

export function techniqueClickHandler(tech: IAvailableTechniques[]) {
    if (!tech) return;
    tech.forEach((technique) => {
        const techniqueEle = document.getElementById(technique.id);
        techniqueEle.addEventListener('click', (element) => {
            const activeTechnique = document.querySelector('.technique-option.active');
            if (activeTechnique) activeTechnique.classList.remove('active');
            // @ts-ignore
            const selectedTechnique = element.target.closest('.technique-option');
            if (selectedTechnique) selectedTechnique.classList.add('active');

            qtyProxy['selectedTechnique'] = technique;
            document.getElementById('selectedTechniqueName').innerHTML = technique.techniqueName;
            qtyChangeHandel(technique);
        });
    });
}

export function assignClickHandlerOnBrand(product: IProductDetail) {
    if (!product) return;
    product.brandingAreas.forEach((tech) => {
        const techEl = document.getElementById(tech.id);
        techEl.addEventListener('click', (element) => {
            const selectedBrand = document.querySelector('.section-img-container.active');
            const activeObjects = qtyProxy?.canvas?.getActiveObjects();
            if (activeObjects && activeObjects.length !== 0) {
                alert("Please clear canvas to change the branding area!");
                return
            }
            if (selectedBrand) selectedBrand.classList.remove('active');
            // @ts-ignore
            const currentSelectionEle = element.target.closest('.section-img-container');
            currentSelectionEle.classList.add('active');
            qtyProxy['selectedBrandingArea'] = tech;
            qtyProxy['selectedTechnique'] = tech?.availableTechniques[0];
            techniqueRender(tech);
            qtyChangeHandel(tech?.availableTechniques[0]);
        });
    });
}

export function techniqueController(defaultSelectedBrandArea: IBrandingAreas, product: IProductDetail) {
    initialSelectionOfBrandingArea(defaultSelectedBrandArea);
    assignClickHandlerOnBrand(product);
}
