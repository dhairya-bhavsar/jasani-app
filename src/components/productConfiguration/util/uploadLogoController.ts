import { qtyProxy } from "../../../..";
import { apiUrls, fileTypeSupport, maxFileSize } from "../../../assets/config";
import { fabric } from "fabric";
import { replaceInnerChildElements, setLoader } from "../../../helpers/helper";

export function uploadLogo(event) {
  const files = event.target.files;
  if (!files || files.length === 0) alert("Please upload file");
  if (!validateImage(files[0])) {
    console.log("file unsupported format!!");
    return;
  }

  const requestObj = new FormData();
  requestObj.append("file", files[0]);
  setLoader(true);
  fetch(apiUrls.imageConvert, {
    method: "POST",
    body: requestObj,
  })
    .then((response) => response.json())
    .then((data) => {
      const id = "id" + Math.random().toString(16).slice(2);

      addApiImageToCanvas(data.data.image, id);
      const preLogoList = qtyProxy?.logoList ?? [];
      qtyProxy["logoList"] = [
        ...preLogoList,
        { id: id, logoColors: data.data.colors, imgUrl: data.data.image },
      ];
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error:", error);
      setLoader(false);
    });
}

function validateImage(file) {
  if (file) {
    //@ts-ignore
    if (fileTypeSupport.includes(file.type)) {
      const size = file.size / 10024 / 10024;
      if (size > maxFileSize) {
        alert("File may not be greater than 10 MB");
        return false;
      } else {
        return true;
      }
    }
    alert("Please upload only this file type: pdf, eps, ai format");
    return true;
  }
  return false;
}

const addApiImageToCanvas = (url, id) => {
  const canvas = qtyProxy?.canvas;
  const imgURL = apiUrls.convertedImage.concat(url);
  fabric.Image.fromURL(imgURL, function (img) {
    if (canvas) {
      const image = img.set({
        borderColor: "#3882c5",
        transparentCorners: false,
        borderScaleFactor: 2,
        padding: 6,
        objectCaching: false,
        id: id,
      });

      const editableArea = canvas
        .getObjects()
        .find((obj) => obj.id === "drawableArea");

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
      canvas.renderAll();
    }
  });
};

const detectedColorsAndSetHandler = (selectedLogo, activeCanvasLogo) => {
  const { logoColors, imgUrl } = selectedLogo;
  const canvas = qtyProxy?.canvas;

  // Add an event listener for the change event on the radio buttons
  const eventListenerForRadioBtn = () => {
    document
      .querySelectorAll('input[name="color"]')
      .forEach((radioButton, index) => {
        radioButton.addEventListener("change", function () {
          const selectedColor = this.value;

          document.querySelectorAll(".replacedByColor").forEach((ele) => {
            if (ele.id === `replacedBy-${index}`) {
              ele.style.display = "block";
              onChangeLogoColor(
                document.getElementById(`replacedBy-${index}-color`),
                selectedColor
              );
            } else {
              ele.style.display = "none";
            }
          });
        });
      });
  };

  const onChangeLogoColor = (element, oldColor) => {
    element.addEventListener("change", (e) => {
      const replacedByColorValue = e.target.value;
      const r = parseInt(replacedByColorValue.substr(1, 2), 16);
      const g = parseInt(replacedByColorValue.substr(3, 2), 16);
      const b = parseInt(replacedByColorValue.substr(5, 2), 16);

      const objToSend = {
        fileName: imgUrl,
        initialColor: oldColor,
        finalColor: `${r},${g},${b}`,
        transparency: false,
        fillType: "multi",
      };

      const jsonString = JSON.stringify(objToSend);

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      // logo color change api calling...
      setLoader(true);
      fetch(apiUrls.imageColorReplace, {
        method: "POST",
        headers: headers,
        body: jsonString,
      })
        .then((response) => response.json())
        .then((data) => {
          let oldColorArray = oldColor.split(",").map(Number);

          const updatedLogoColors = logoColors.map((clr) =>
            oldColorArray.every((val, index) => val === clr[index])
              ? [r, g, b]
              : clr
          );

          const uniqueLogoColors = [
            //@ts-ignore
            ...new Set(updatedLogoColors.map(JSON.stringify)),
            //@ts-ignore
          ].map(JSON.parse);

          const colorList = qtyProxy?.logoList;
          const newLogoList = colorList.map((logo) => {
            if (logo.id === selectedLogo.id) {
              return {
                id: logo.id,
                logoColors: uniqueLogoColors,
                imgUrl: data.data,
              };
            } else {
              return logo;
            }
          });

          qtyProxy["logoList"] = newLogoList;

          addNewColorsList(uniqueLogoColors);

          const imgURL = apiUrls.convertedImage.concat(data.data);

          activeCanvasLogo.setSrc(imgURL, function () {
            canvas.renderAll();
            setLoader(false);
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoader(false);
        });
    });
  };

  const addNewColorsList = (logoColors) => {
    const newColorsHTML = `
       <div id="logoColors" style="display: flex; ">
           ${logoColors
             .map((color, index) => {
               const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
               return `
               <div>
                  <div style="display: flex;">
                  <label for="color-${index}" style="margin: 5px; cursor: pointer;">
                    <input type="radio" id="color-${index}" name="color" value="${[
                 color[0],
                 color[1],
                 color[2],
               ]}" style="display: none;">
                    <div class="replaceWithColor" id="color-div-${index}" style="background-color: ${rgbColor}; width: 50px; height: 50px; border: 2px solid transparent;"></div>
                  </label>
                  </div>
                  <div class="replacedByColor" id="replacedBy-${index}" style="display: none;">
                     <input type="color" id="replacedBy-${index}-color"/>
                  </div>
               </div>
               `;
             })
             .join(" ")}
       </div>
      `;

    replaceInnerChildElements(
      document.getElementById("logoColorsWrapper"),
      newColorsHTML
    );

    eventListenerForRadioBtn();
  };

  addNewColorsList(logoColors);
};

const logoSelectionEventHandler = () => {
  const canvas = qtyProxy?.canvas;

  const onLogoChangeEvent = () => {
    const logoList = qtyProxy?.logoList;
    const activeCanvasObj = canvas?.getActiveObjects();

    if (activeCanvasObj.length > 0 && activeCanvasObj[0].type === 'image') {
      document.getElementById("mainImageContainer").style.display = "block";
      const selectedLogo = logoList.find(
        (logo) => logo.id === activeCanvasObj[0].id
      );
      detectedColorsAndSetHandler(selectedLogo, activeCanvasObj[0]);
    } else {
      document.getElementById("mainImageContainer").style.display = "none";
    }
  };

  canvas.on("selection:updated", onLogoChangeEvent);
  canvas.on("selection:created", onLogoChangeEvent);
  canvas.on("selection:cleared", onLogoChangeEvent);
};

export function initUploadLogoButton() {
  const btn = document.getElementById("uploadLogo");
  if (!btn) return;
  btn.addEventListener("change", uploadLogo);
  logoSelectionEventHandler();
}
