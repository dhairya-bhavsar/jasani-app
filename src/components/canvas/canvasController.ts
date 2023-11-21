import { fabric } from "fabric";
import { addTextToCanvasHandler, changeFontFamilyHandler, changeFontSizeHandler, changeTextAlignHandler, changeTextColor, editTextHandler, fontBoldUnderlineAndItalicHandler} from "../productDetail/textController";

//Download link helper
const generateDownloadLink = (canvas, name, type) => {
    let url = "";

    if (type === "json") {
      const canvasData = JSON.stringify(canvas.toJSON());
      const canvasBlob = new Blob([canvasData], { type: "application/json" });
      url = URL.createObjectURL(canvasBlob);
    }
    if (type === "image") {
      url = canvas.toDataURL({
        format: "png",
        quality: 1,
      });
    }

    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();

      // Release the URL object
      URL.revokeObjectURL(url);
    }
  };


  //Initialise both canvas
  export const initialiseCanvas = (selectedImgForBG) =>{
    const productCanvasElement = document.getElementById(
      "ProductCanvas"
    ) as HTMLCanvasElement;
    const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;


    const productCanvas: fabric.Canvas = new fabric.Canvas(
      productCanvasElement,
      {
        width: 500,
        height: 500,

  });

    const canvas: fabric.Canvas = new fabric.Canvas(canvasElement, {
        width: selectedImgForBG.width,
        height: selectedImgForBG.height,
    });

    return {canvas, productCanvas};
};

  //Image handling
  export function addImageToCancasHandler(canvas) {
    const imageInput: HTMLInputElement | null = document.getElementById(
      "imageInput"
    ) as HTMLInputElement;

    imageInput?.addEventListener("change", function (e: Event) {
      const target = e.target as HTMLInputElement;
      const file: File | undefined = target.files ? target.files[0] : undefined;

      if (file) {
        const reader: FileReader = new FileReader();

        reader.onload = function (event: ProgressEvent<FileReader>) {
          if (event.target) {
            const imgData: string = event.target.result as string;
            fabric.Image.fromURL(imgData, function (img: fabric.Image) {
              if (canvas) {
                canvas.add(img);

                img.set({
                  left: 0,
                  top: 0,
                  scaleX: 0.1,
                  scaleY: 0.1,
                });

                canvas.renderAll();
              }
            });
          }
        };

        reader.readAsDataURL(file);
      }
    });
  }

  // Function to delete all selected objects
  export const deleteSelectedObjects = (canvas) => {
    document.getElementById("deleteButton")?.addEventListener("click", () => {
      const selectedObjects: fabric.Object[] = canvas.getActiveObjects();

      selectedObjects?.forEach((object: fabric.Object) => {
        if (canvas) {
          canvas.remove(object);
        }
      });

      if (canvas) {
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    });
  };

  //Download AS  Image
  export function downloadImageHandler(canvas,productCanvas) {
    document
      .getElementById("downloadImgButton")
      ?.addEventListener("click", () => {
        if (canvas && productCanvas) {
          generateDownloadLink(canvas,"section-canvas.png","image");
        generateDownloadLink(productCanvas, "roduct-img-canvas.png", "image");
      }
    });
}

  //Download as JSON
  export const downloadJson = (canvas, productCanvas) => {
    const getJsonButton = document.getElementById("getJson");
    getJsonButton?.addEventListener("click", () => {
      if(canvas && productCanvas){
        generateDownloadLink(canvas,"section-canvas.json","json");
        generateDownloadLink(productCanvas,"product-img-canvas.json","json");
      }
    });
  };

  //Canvas backgound image and position handling

  //1) setting backgroung image
  export const setBackgroundImg = (productCanvas, selectedImgForBG) => {
    productCanvas.setBackgroundImage(
      selectedImgForBG,
      productCanvas.renderAll.bind(productCanvas),

    );
    // productCanvas.center()
  };

  //2)set canvas above product canvas for specific positiom
  export const setCustomiseCanvas = (selectedImgForBG) => {
    const element = document.getElementById("productCanvasWrapper");
    const outerElement = document.getElementById("productContentBorder");
    if(element) {
      element.style.cssText = `
        top: ${selectedImgForBG.top};
        left: ${selectedImgForBG.left};
        width: ${selectedImgForBG.width +4}px;
        height: ${selectedImgForBG.height + 4}px;
      `
    }
    if (outerElement) {
      outerElement.style.cssText = `
        width: ${selectedImgForBG.width + 19}px;
        height: ${selectedImgForBG.height + 19}px;
      `
    }
};

//Tab set handling
export function openTab() {
  document.querySelectorAll(".step-button").forEach((ele) => {
    ele.addEventListener("click", () => {
      const active = document.querySelector('.step-button.active');
      if (active) active.classList.remove('active');
      ele.classList.add('active');
      let items = document.getElementsByClassName("tabView");
      for (let item of items) {
        item.classList.remove("tabShow");
        item.classList.add("tabHide");
      }
      document.getElementById(ele.name).classList.remove("tabHide");
      document.getElementById(ele.name).classList.add("tabShow");
    });
  });
}

//Download merged images

export const downloadFullImage = (canvas, productCanvas,selectedImage) => {
  document
    .getElementById("downloadFullImage")
    .addEventListener("click", () => {
      if (canvas && productCanvas) {
        const tempCanvasElement = document.createElement("canvas");
        tempCanvasElement.setAttribute("id", "tempCanvas");

        const tempCanvas = new fabric.Canvas("tempCanvas", {
          width: 500,
          height: 500,
        });
        const productCanvasJson = JSON.stringify(productCanvas.toJSON());

        const sectionImage = canvas.toDataURL({
          format: "png",
          quality: 1,
        });

        tempCanvas.loadFromJSON(productCanvasJson, () => {

          fabric.Image.fromURL(
            sectionImage,
            function (myImg) {

              const img1 = myImg.set({
                left: +selectedImage?.left.slice(0,-2) ?? 0,
                top: +selectedImage?.top.slice(0,-2) ?? 0,

              });
              tempCanvas.add(img1);
              setTimeout(()=>{
                generateDownloadLink(tempCanvas, "full-image.png", "image");
              },2000)
            }
            );
          });

        }
    });
};

const clearCanvasHandler = (canvas) =>{
  document.getElementById("clearCanvas").addEventListener("click",()=>{
    canvas.clear();
  })
}

//One time initialiasation for add canvas fuctionality
export const initialCallHandler = (canvas, productCanvas,selectedImage) => {
  addImageToCancasHandler(canvas);
  addTextToCanvasHandler(canvas);
  changeTextColor(canvas);
  downloadImageHandler(canvas, productCanvas);
  deleteSelectedObjects(canvas);
  downloadJson(canvas, productCanvas);
  openTab();
  downloadFullImage(canvas, productCanvas,selectedImage);
  clearCanvasHandler(canvas);
  changeFontFamilyHandler(canvas);
  changeFontSizeHandler(canvas);
  fontBoldUnderlineAndItalicHandler(canvas);
  editTextHandler(canvas);
  changeTextAlignHandler(canvas)
};
