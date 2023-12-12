import {replaceCurrentElementWithNewId} from "../../../helpers/helper";
import {DownloadImage} from "./downloadCanvas.ts";


const dialog = document.getElementById("previewDialog") as HTMLDialogElement;

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
      const imageName = Date.now().toString();
      DownloadImage(imageName);
    });
}

export function finishBtnEvents() {
  const btn = document.getElementById('finishBtn');
  if(!btn) return;
  btn.addEventListener('click', function () {
    const backBtn = document.getElementById('back-btn');
    if (!backBtn) return;
    if (confirm("Are you sure editing is completed?")) {
      backBtn.click();
    }
  })
}

export const initialisePopupFunctions = () => {
  addPreviewEvents();
  finishBtnEvents();
};
