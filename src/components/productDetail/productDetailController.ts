import { images } from "../../assets/images";
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
      setCustomiseCanvas(newTechnique.availableSections[0]);
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
