import {fabric} from "fabric";
import {images} from "../../../assets/images";
import {qtyProxy} from "../../../../index";
import {IBrandingAreas} from "../type";
import {
  DownloadImage,
  initUndoRedoEventHandler,
  clickStepBtnHandler,
  checkNextButtonActive,
  initAligningGuidelines
} from "../util";
import { errorMessages } from "../../../assets/config";

let canvas, drawableArea, editor;

export function mouseZoom() {
  document.getElementById("zoomIn").addEventListener("click", () => {
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** -20;
    if (zoom > 3) zoom = 3;
    if (zoom < 1) zoom = 1;
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
  });

  document.getElementById("zoomOut").addEventListener("click", () => {
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** 20;
    if (zoom > 20) zoom = 20;
    if (zoom < 1) zoom = 1;
    canvas.zoomToPoint({ x: canvas.width / 2, y: canvas.height / 2 }, zoom);
  });

  canvas.on("mouse:wheel", function (opt) {
    let delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 3) zoom = 3;
    if (zoom < 1) zoom = 1;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });

  let isPanning = false;

  canvas.on("mouse:down", function () {
    if (!canvas.getActiveObject()) {
      isPanning = true;
      canvas.defaultCursor = "grabbing"; // Change cursor to indicate panning
    }
  });

  canvas.on("mouse:up", function () {
    isPanning = false;
    canvas.defaultCursor = "grab"; // Restore default cursor
  });

  canvas.on("mouse:move", function (event) {
    if (isPanning && event && event.e) {
      let delta = new fabric.Point(event.e.movementX, event.e.movementY);
      canvas.relativePan(delta);
    }
  });
}

export function initCanvas(defaultSelectedBrandingArea: IBrandingAreas) {
  const initImage =
    images[defaultSelectedBrandingArea.defaultImage];

  canvas = new fabric.Canvas("productCanvas", {
    selection: false,
    controlsAboveOverlay: true,
    // @ts-ignore
    uniScaleKey: false
  });
  qtyProxy["canvas"] = canvas;
  canvas.setOverlayImage(initImage, canvas.renderAll.bind(canvas), {
    selectable: false,
    globalCompositeOperation: "destination-atop",
  });
  fabric.Object.prototype.transparentCorners = false;

  // Created the drawable area.
  editor = new fabric.Rect({
    top: +defaultSelectedBrandingArea.top,
    left: +defaultSelectedBrandingArea.left,
    width: defaultSelectedBrandingArea.width,
    height: defaultSelectedBrandingArea.height,
  });

  drawableArea = new fabric.Rect({
    // @ts-ignore
    id: "drawableArea",
    top: +defaultSelectedBrandingArea.top,
    left: +defaultSelectedBrandingArea.left,
    width: defaultSelectedBrandingArea.width + 20,
    height: defaultSelectedBrandingArea.height + 20,
    fill: "transparent",
    stroke: "red",
    strokeWidth: 1,
    strokeDashArray: [10],
    selectable: false,
  });

  qtyProxy["drawableArea"] = drawableArea;
  qtyProxy["canvasEditor"] = editor;
  canvas.clipPath = editor;
  canvas.add(drawableArea);
  mouseZoom();

  qtyProxy["initialHistory"] = {
    state: [
      {
        canvasJson: JSON.stringify(canvas.toJSON(["id", "selectable"])),
        PreLogoList: [],
      },
    ],
    currentStateIndex: 0,
    undoStatus: false,
    redoStatus: false,
    undoFinishedStatus: true,
    redoFinishedStatus: true,
  };
  initUndoRedoEventHandler();
  initAligningGuidelines();
}

export function canvasConfigurationChangeHandler(brand: IBrandingAreas) {
  canvas?.overlayImage?.setSrc(
    images[brand.defaultImage],
    canvas.renderAll.bind(canvas)
  );
  const newCoords = {
    top: brand.top,
    left: brand.left,
    width: brand.width,
    height: brand.height,
  };
  editor.set(newCoords);
  drawableArea.set(newCoords);
  editor.setCoords();
  drawableArea.setCoords();
  qtyProxy["drawableArea"] = drawableArea;
  qtyProxy["canvasEditor"] = editor;
  qtyProxy["selectedBrandArea"] = brand;
}

// Function to delete selected objects
export const deleteSelectedObjects = () => {
  document.getElementById("deleteButton")?.addEventListener("click", () => {
    const selectedObject = canvas.getActiveObject();
    const logoListCopy = JSON.parse(JSON.stringify(qtyProxy?.logoList || []));
    if (!selectedObject) {
      alert(errorMessages.ALERT_OBJECT_SELECTION);
      return
    }
    const logoIndex = logoListCopy?.findIndex((el) => el.id == selectedObject.id);
    if (selectedObject && canvas && confirm(errorMessages.CONFIRMATION_MESSAGE)) {
      if (logoIndex >= 0) {
        logoListCopy.splice(logoIndex, 1)
        qtyProxy['logoList'] = JSON.parse(JSON.stringify(logoListCopy));
      }
      canvas.remove(selectedObject);
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.fire("object:modified");
      return;
    }
    console.log("Object not found!!");
  });
};

export const saveImage = (name = "") => {
  name = Date.now().toString();
  const saveButton = document.getElementById("downloadFullImage");
  if (!saveButton) return;

  saveButton.addEventListener("click", () => {
    DownloadImage(name);
    canvas.renderAll();
  });
};

export const clearCanvasHandler = () => {
  document.getElementById("clearCanvas").addEventListener("click", () => {
    const confirmation = !qtyProxy.backOnTab ? confirm("Are you sure want to clear canvas?") : true;
    if (confirmation) {
      [...canvas.getObjects()].forEach((element) => {
        if (element.id !== "drawableArea") {
          canvas.remove(element);
        }
      });
      qtyProxy['logoList'] = [];
      checkNextButtonActive();
      initUndoRedoEventHandler();
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      qtyProxy['backOnTab'] = false;
      document
        .getElementById(qtyProxy?.selectedProduct?.brandingAreas[0]?.id)
        .click();
      clickStepBtnHandler(0);
    }
  });
};


export function alignObjectHandler() {
  const drawableArea = qtyProxy?.drawableArea;
  const alignSelector = document.getElementById("activeObjAlign") as HTMLSelectElement;

  if (!alignSelector) return;

  alignSelector.addEventListener("change", () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      const { top: areaTop, left: areaLeft, width: areaWidth, height: areaHeight } = drawableArea;


      switch (alignSelector.value) {
        case "top":
          activeObject.set("top", areaTop);
          break;
        case "bottom":
          activeObject.set("top", areaTop + areaHeight - activeObject.getScaledHeight());
          break;
        case "left":
          activeObject.set("left", areaLeft);
          break;
        case "right":
          activeObject.set("left", areaLeft + areaWidth - activeObject.getScaledWidth());
          break;
        case "center":
          activeObject.set("left", areaLeft + (areaWidth / 2) - ( activeObject.getScaledWidth() / 2));
          activeObject.set("top", areaTop + (areaHeight / 2) - ( activeObject.getScaledHeight() / 2));
          break;
        default:
          return;
      }

      canvas.fire("object:modified");
      canvas.renderAll();
    }else {
      alert(errorMessages.OBJ_NOT_SELECTED);
      // @ts-ignore
      alignSelector.value = "align";
    }
  });

    canvas.on("selection:cleared" , () => {
    alignSelector.value = "align"
  })
}

