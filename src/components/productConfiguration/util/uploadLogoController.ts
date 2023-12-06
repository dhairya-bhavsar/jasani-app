//@ts-nocheck
import {qtyProxy} from "../../../..";
import {apiUrls, errorMessages, fileTypeSupport, maxFileSize} from "../../../assets/config";
import {fabric} from "fabric";
import {
  compareArr,
  hexToRgb,
  replaceCurrentElementWithNewId,
  setLoader, uniqBy
} from "../../../helpers/helper";
import { clickStepBtnHandler } from ".";

function clearUploadInputValue() {
  document.getElementById('uploadLogo').value = "";
}

export async function uploadLogo(event) {
  const files = event.target.files;
  if (!files || files.length === 0) alert(errorMessages.UPLOAD_FILE);
  if (!validateImage(files[0])) {
    console.log("file unsupported format!!");
    return;
  }

  const requestObj = new FormData();
  requestObj.append("file", files[0]);
  if (qtyProxy?.selectedTechnique?.techniqueName === "Laser Engraving") {
    requestObj.append("removeBackground", "True")
  }
  setLoader(true);
  try {
    const response = await fetch(apiUrls.imageConvert, {
      method: "POST",
      body: requestObj,
    });
    setLoader(false);
    const data = await response.json();
    const id = "id" + Math.random().toString(16).slice(2);
    if (!data.data.image) {
      alert(errorMessages.LOGO_NOT_PROPER);
      return
    }

    addApiImageToCanvas(data.data.image, id);
    const preLogoList = qtyProxy?.logoList ?? [];
    qtyProxy["logoList"] = [
      ...preLogoList,
      { id: id, logoColors: data.data.colors, imgUrl: data.data.image },
    ];
    clearUploadInputValue();
    if (qtyProxy?.selectedTechnique?.techniqueName === "Laser Engraving") {
      qtyProxy['selectedLogo'] = qtyProxy?.logoList[0];
      qtyProxy["oldColor"] = data.data.colors[0].toString();
      qtyProxy["newColor"] = [192,192,192];
      const objToSend = {
        fileName: data.data.image,
        initialColor: qtyProxy?.oldColor,
        finalColor: `${qtyProxy.newColor[0]},${qtyProxy.newColor[1]},${qtyProxy.newColor[2]}`,
        transparency: false,
        fillType: "single",
      };

      const jsonString = JSON.stringify(objToSend);
      await convertLogoColor(jsonString);
    }
  } catch (error) {
    console.log("Convert API issue");
    alert(errorMessages.SERVER_ERROR);
    setLoader(false);
  }
}

function validateImage(file) {
  if (file) {
    //@ts-ignore
    if (fileTypeSupport.includes(file.type)) {
      const size = file.size / 10024 / 10024;
      if (size > maxFileSize) {
        clearUploadInputValue();
        alert(errorMessages.LOGO_FILE_GREATER);
        return false;
      }
      return true;
    }
    clearUploadInputValue();
    alert(errorMessages.LOGO_FORMATE_ISSUE);
    return false;
  }
  return false;
}

const addApiImageToCanvas = (url, id) => {
  const canvas = qtyProxy?.canvas;
  const imgURL = apiUrls.convertedImage.concat(url);
  fabric.Image.fromURL(imgURL, function (img) {
    if (canvas) {
      const image = img.set({
        padding: 2,
        objectCaching: false,
        id: id,
      });

      const editableArea = qtyProxy?.drawableArea;

      // Resize the image to fit within the canvas
      if (img.width > editableArea.width || img.height > editableArea.height) {
        let scale =
          Math.min(
            editableArea.width / img.width,
            editableArea.height / img.height
          ) - 0.05;
        img.scale(scale);
      }

      // Calculate top and left positions to center the image within the drawable area
      const top =
        editableArea.top + (editableArea.height - img.height * img.scaleY) / 2;
      const left =
        editableArea.left + (editableArea.width - img.width * img.scaleX) / 2;

      image.set({
        top: top,
        left: left,
      });

      canvas.add(image);
      setLoader(false);
      canvas.setActiveObject(image);
      canvas.renderAll();
    }
  }, {crossOrigin: "Anonymous"});
};

export function colorSelectionHandle() {
  const colorElement = document.querySelectorAll('.logo-color');
  if (!colorElement) return;
  colorElement.forEach((el, index) => {
    el.addEventListener('click', () => {
      const previousSelection = document.querySelector('.replacedByColor.show');
      if (previousSelection) {
        previousSelection.classList.add('hidden');
        previousSelection.classList.remove('show');
      }
      const changeInput = document.getElementById(`replacedBy-${index}`);
      if (!changeInput) return;
      changeInput.classList.remove('hidden');
      changeInput.classList.add('show');
      qtyProxy['oldColor'] = el.value;
      onChangeLogoColor(index);
    });
  })
}

function updateListOfColors() {
  const newSelectedLogo = {...qtyProxy?.selectedLogo};
  const oldColor = qtyProxy?.oldColor.split(",");
  newSelectedLogo?.logoColors.forEach((el, index) => {
    if (compareArr(el, oldColor)) {
      if (qtyProxy?.newColor) newSelectedLogo.logoColors[index] = [...qtyProxy?.newColor];
      if (!qtyProxy?.newColor) delete newSelectedLogo.logoColors[index];
    }
  });
  newSelectedLogo.logoColors = uniqBy(newSelectedLogo.logoColors, JSON.stringify)
  qtyProxy['selectedLogo'] = newSelectedLogo;
  const logoList = JSON.parse(JSON.stringify(qtyProxy?.logoList));
  const index = logoList?.findIndex((el) => el.id === newSelectedLogo.id);
  logoList[index] = newSelectedLogo;
  qtyProxy['logoList'] = logoList;
  delete qtyProxy.newColor;
  colorContainerHtmlRender();
}

function setUpdatedImage(imageName, colorChange = true) {
  const imgURL = apiUrls.convertedImage.concat(imageName);
  const logoUrl = qtyProxy?.selectedLogo;
  logoUrl['imgUrl'] = imageName;
  const activeCanvasObj = qtyProxy?.canvas?.getActiveObjects()[0];
  activeCanvasObj.setSrc(imgURL, function () {
    qtyProxy?.canvas.renderAll();
    setLoader(false);
    updateListOfColors();
    if (colorChange) qtyProxy?.canvas?.fire('object:modified');
  }, {crossOrigin: "Anonymous"});
}

async function convertLogoColor(requestObject) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  setLoader(true);
  try {
    const response = await fetch(apiUrls.imageColorReplace, {
      method: "POST",
      headers: headers,
      body: requestObject,
    });
    const data = await response.json();
    setUpdatedImage(data.data);
  } catch (error) {
    console.log("color change api error!!!");
    alert(errorMessages.SERVER_ERROR);
    setLoader(false);
  }
}

function onChangeLogoColor(index) {
  const colorInput = document.getElementById(`replacedBy-${index}`);
  if (!colorInput) return;
  colorInput.addEventListener('change', (e) => {
    const replacedByColorValue = e.target.value;
    qtyProxy['newColor'] = hexToRgb(replacedByColorValue);

    const objToSend = {
      fileName: qtyProxy?.selectedLogo?.imgUrl,
      initialColor: qtyProxy?.oldColor,
      finalColor: `${qtyProxy.newColor[0]},${qtyProxy.newColor[1]},${qtyProxy.newColor[2]}`,
      transparency: false,
      fillType: "multi",
    };

    const jsonString = JSON.stringify(objToSend);
    convertLogoColor(jsonString);
  });
}

export function logoDimensionHandler() {
  const canvas = qtyProxy?.canvas;
  const activeCanvasObj = canvas?.getActiveObjects()[0];
  const width = document.getElementById('logoWidth');
  const height = document.getElementById('logoHeight');
  width.addEventListener('change', (event) => {
    const value = +event.target.value;
    activeCanvasObj.scaleToWidth(value);
    canvas.renderAll();
  });
  height.addEventListener('change', (event) => {
    const value = +event.target.value;
    activeCanvasObj.scaleToHeight(value);
    canvas.renderAll();
  });
}

async function removeButtonHandle(event) {
  qtyProxy['backgroundColorChecked'] = event.target.checked;
  const reqObject = {
    fileName: qtyProxy?.selectedLogo?.imgUrl,
    action: event.target.checked ? 'remove' : 'add',
    bgRGB: event.target.checked ? '' : qtyProxy?.backgroundColor?.toString()
  }
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  setLoader(true);
  try {
    const response = await fetch(apiUrls.backgroundRemove, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(reqObject),
    });
    const data = await response.json();
    qtyProxy['backgroundColor'] = data?.data?.bgRGB;
    if (event.target.checked) {
      qtyProxy['oldColor'] = data?.data?.bgRGB?.toString();
    } else {
      const logoUrl = qtyProxy?.selectedLogo;
      logoUrl['logoColors']?.unshift([...qtyProxy['oldColor'].split(',')]);
      qtyProxy['newColor'] = [...qtyProxy['oldColor'].split(',')];
    }
    setUpdatedImage(data.data.image, false);
  } catch (error) {
    console.log('Background color API calling!!');
    setLoader(false);
  }
  // removeBackgroundAPI()
}
export function removeBackgroundHandler() {
  const removeButton = document.getElementById('removeWhiteBg');
  if (!removeButton) return;
  if (qtyProxy?.selectedTechnique?.techniqueName === "Laser Engraving") {
    removeButton.disabled = true;
    return;
  }
  removeButton.checked = qtyProxy?.backgroundColorChecked || false;
  removeButton.addEventListener('change', removeButtonHandle);
}

export function colorContainerHtmlRender() {
  const canvas = qtyProxy?.canvas;
  const activeCanvasObj = canvas?.getActiveObjects()[0];
  const width = (activeCanvasObj?.getScaledWidth()).toFixed(0)
  const height = (activeCanvasObj?.getScaledHeight()).toFixed(0);
  const logoList = JSON.parse(JSON.stringify(qtyProxy?.logoList));
  const selectedLogo = logoList.find(
      (logo) => logo.id === activeCanvasObj.id
  );
  qtyProxy['selectedLogo'] = selectedLogo;

  const colorListHtml = `
    <div class="logo-configuration">
      <div class="color-container">
          <p class="font-bold">Logo Colors</p>
           ${selectedLogo?.logoColors.map((color, index) => {
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            return `
               <div class="color-selector">
                  <input type="radio" id="color-${index}" class="logo-color" name="color-group" value="${[color[0], color[1], color[2]]}">
                  <label for="color-${index}" style="background-color: ${rgbColor}"></label>
                  <div class="replacedByColor hidden" id="replacedBy-${index}">
                   <input type="color" id="replacedBy-color-${index}" value="#000002"/>
                  </div>
              </div>` ;
            }).join(" ")}   
      </div>
      <div class="logo-dimensions">
          <div class="input-group">
              <label for="logoWidth">Logo width: </label>
              <input type="number" id="logoWidth" value="${width}" />
          </div>
          <div class="input-group">
              <label for="logoHeight">Logo height: </label>
              <input type="number" id="logoHeight" value="${height}" placeholder="" />
          </div>
          <div class="input-group">
            <input type="checkbox" id="removeWhiteBg" placeholder="" />
            <label for="removeWhiteBg">Remove Background</label>
          </div> 
      </div>
    </div>
      `;
  replaceCurrentElementWithNewId('colorContainer', colorListHtml);
  colorSelectionHandle();
  logoDimensionHandler();
  removeBackgroundHandler();
}

const onLogoChangeEvent = () => {
  const canvas = qtyProxy?.canvas;
  const activeCanvasObj = canvas?.getActiveObjects()[0];
  const container = document.getElementById("colorContainer");
  if (activeCanvasObj && activeCanvasObj.type === 'image') {
    container.classList.remove('hidden');
    colorContainerHtmlRender();
    clickStepBtnHandler(1);
  } else {
    container.classList.add('hidden');
  }
};

const logoSelectionEventHandler = () => {
  const canvas = qtyProxy?.canvas;
  canvas.on("selection:updated", onLogoChangeEvent);
  canvas.on("selection:created", onLogoChangeEvent);
  canvas.on("selection:cleared", onLogoChangeEvent);
  canvas.on('object:modified', onLogoChangeEvent);
};

export function initUploadLogoButton() {
  const btn = document.getElementById("uploadLogo");
  if (!btn) return;
  btn.addEventListener("change", uploadLogo);
  logoSelectionEventHandler();
}
