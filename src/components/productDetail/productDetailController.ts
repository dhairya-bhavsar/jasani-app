import { images } from "../../assets/images";
import { getElement, replaceInnerChildElements } from "../../helpers/helper";
import {
  setBackgroundImg,
  setCustomiseCanvas,
  downloadFullImage,
} from "../canvas/canvasController";

/*
 * id : selected printing technique id.
 * availableOptions : the nodes of available techniques.
 */
const toggleClassForTechnique = (id, availableOptions) => {
  const availableSections = document.querySelectorAll(".section-img-container");

  availableOptions.forEach((element) => {
    element.id === id
      ? element.classList.add("active")
      : element.classList.remove("active");
  });

  // bydefault 1st is selected when change technique
  availableSections[0].classList.add("active");
};

/*
 * productDetail : selected product details.
 * setNewImageSections : function which replace the available section as per technique selected.
 * productCanvas : product canvas.
 * canvas : section canvas.
 */
export const selectTechniqueHandler = (
  productDetail,
  setNewImageSections,
  productCanvas,
  canvas
) => {
  const availableOptions = document.querySelectorAll(".technique-option");
  const availableSections = document.querySelectorAll(".section-img-container");

  //initially 1st option selected
  availableOptions[0].classList.add("active");
  availableSections[0].classList.add("active");

  availableOptions.forEach((element) => {
    element.addEventListener("click", () => {
      const currentQty = getElement("qtySelector")?.value;

      const newTechnique = productDetail.availableTechniques.find(
        (option) => option.id === element.id
      );
      setNewImageSections(newTechnique);
      toggleClassForTechnique(newTechnique.id, availableOptions);
      setBackgroundImg(
        productCanvas,
        images[newTechnique.availableSections[0].path]
      );
      viewChangeHandler(newTechnique, productCanvas, canvas);
      canvas.setDimensions({
        width: newTechnique.availableSections[0].width,
        height: newTechnique.availableSections[0].height,
      });
      downloadFullImage(
        canvas,
        productCanvas,
        newTechnique.availableSections[0]
      );
      setCustomiseCanvas(newTechnique.availableSections[0]);
      priceCalculator(currentQty, newTechnique.pricing);
    });
  });
};

/*
 * selectedId : selected canvas section id.
 */
const toggleClassForSection = (selectedId) => {
  const availableSections = document.querySelectorAll(".section-img-container");
  availableSections.forEach((element) =>
    element.id === selectedId
      ? element.classList.add("active")
      : element.classList.remove("active")
  );
};

/*
 * newTechnique : selected technique.
 * productCanvas : product canvas.
 * canvas : section canvas.
 */
export function viewChangeHandler(newTechnique, productCanvas, canvas) {
  document.querySelectorAll(".section-img-container").forEach((el) => {
    el.addEventListener("click", () => {
      const newBGImage = newTechnique.availableSections.find(
        ({ id }) => id === el.id
      );

      toggleClassForSection(el.id);
      setBackgroundImg(productCanvas, images[newBGImage.path]);
      setCustomiseCanvas(newBGImage);
      canvas.setDimensions({
        width: newBGImage.width,
        height: newBGImage.height,
      });
      downloadFullImage(canvas, productCanvas, newBGImage);
    });
  });
}

/*
 * qty : quantity added by user.
 * pricing : pricing object related to selected printing technique.
 */
export const priceCalculator = (qty, pricing) => {
  const priceParentNode = getElement("unitCharge");
  if (+qty <= 0) {
    return;
  }

  const pricingData = pricing?.find((data) => {
    if (+qty >= +data.min_qty && +qty <= +data.max_qty) {
      return true;
    }
    if (
      !(+qty >= +data.min_qty && +qty <= +data.max_qty) &&
      data.max_qty === ""
    ) {
      return true;
    }
  });

  const totalCost = (
    +pricingData?.price_fixed_cost +
    pricingData?.price_per_unit_cost * +qty
  ).toFixed(2);

  const printCost = (+totalCost / +qty).toFixed(2);

  const newPriceHTML = `
    <div class="unit-charge">
       <div>
          <span>Setup Charge(fixed): <p class="font-bold"> AED ${pricingData?.price_fixed_cost}</p></span>
          <span>Print Charge(per unit): <p class="font-bold"> AED ${pricingData?.price_per_unit_cost}</p></span>
        </div>
        <div class="cost-calculation">
          <span>Total Cost: <p class="font-bold"> AED ${totalCost}</p></span>
          <span>Print Cost: <p class="font-bold"> AED ${printCost}</p></span>
        </div>
    </div>
  `;

  replaceInnerChildElements(priceParentNode, newPriceHTML);
};

/*
 *pricing : pricing object related to selected printing technique.
 */
export const qtyChangeHandler = (pricing) => {
  getElement("qtySelector").addEventListener("input", (event) => {
    priceCalculator(event.target.value, pricing);
  });
};
