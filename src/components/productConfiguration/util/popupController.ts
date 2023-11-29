//@ts-nocheck
import {replaceCurrentElementWithNewId} from "../../../helpers/helper";
import { DownloadImage } from "./downloadCanvas";

const dialog = document.getElementById("previewDialog");

function addPreviewImage() {
  const url = DownloadImage(" ", "image", false);

  const dialogHtml = `
   <img src=${url} alt="final-image"/>
   `;

  replaceCurrentElementWithNewId("imageConatiner", dialogHtml);
}

function addPreviewEvents() {
  const openPreviewBtn = document.getElementById("openPreviewBtn");
  const closePreviewBtn = document.getElementById("closePreviewBtn");

  [openPreviewBtn, closePreviewBtn]?.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.id === "openPreviewBtn") {
        dialog.showModal();
        addPreviewImage();
      } else {
        dialog.close();
      }
    });
  });

  document
    .getElementById("downloadImgPreview")
    .addEventListener("click", () => {
      const imageName = Date.now();
      DownloadImage(imageName);
    });
}

export const initialisePopupFunctions = () => {
  addPreviewEvents();
};
