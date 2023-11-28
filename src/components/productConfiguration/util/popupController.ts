//@ts-nocheck
import { replaceInnerChildElements } from "../../../helpers/helper";
import { DownloadImage } from "./downloadCanvas";

const dialog = document.getElementById("previewDialog");
const imageConatiner = document.getElementById("imageConatiner");

function addPreviewImage() {
  const url = DownloadImage(" ", "image", false);

  const dialogHtml = `
   <img src=${url} alt="final-image"/>
   `;

   replaceInnerChildElements(imageConatiner,dialogHtml);
}

function addPreviewEvents() {
  const openPreviewBtn = document.getElementById("openPreviewBtn");
  const closePreviewBtn = document.getElementById("closePreviewBtn");

  [openPreviewBtn, closePreviewBtn].forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log(btn, "btnnn ??");
      btn.id === "openPreviewBtn" ? dialog.showModal() : dialog.close();
      addPreviewImage();
    });
  });

  document.getElementById("downloadImgPreview").addEventListener('click', () => {
    const Imagename = Date.now();
    DownloadImage(Imagename);
});
}

export const initialisePopupFunctions = () => {
  addPreviewEvents();
};
