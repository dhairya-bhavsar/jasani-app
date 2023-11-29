// @ts-nocheck
import {fabric} from "fabric";
import {images} from "../../../assets/images";
import {qtyProxy} from "../../../../index";
import {IAvailableSections} from "../type";
import {DownloadImage} from "../util/downloadCanvas.ts";
import {getElement} from "../../../helpers/helper.ts";

let canvas, drawableArea, editor;

export function mouseZoom() {
    document.getElementById("zoomIn").addEventListener("click", (opt) => {
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

    canvas.on('mouse:down', function (event) {
        if (!canvas.getActiveObject()) {
            isPanning = true;
            canvas.defaultCursor = 'grabbing'; // Change cursor to indicate panning
        }
    });

    canvas.on('mouse:up', function (event) {
        isPanning = false;
        canvas.defaultCursor = 'grab'; // Restore default cursor
    });

    canvas.on('mouse:move', function (event) {
        if (isPanning && event && event.e) {
            let delta = new fabric.Point(event.e.movementX, event.e.movementY);
            canvas.relativePan(delta);
        }
    });
}

export function initCanvas(defaultSelectedTechnique) {
    const initImage = images[defaultSelectedTechnique.availableSections[0].defaultImage];
    canvas = new fabric.Canvas("productCanvas", {
        selection: false,
        controlsAboveOverlay: true
    });
    qtyProxy['canvas'] = canvas;
    canvas.setOverlayImage(initImage, canvas.renderAll.bind(canvas), {
        selectable: false,
        globalCompositeOperation: 'destination-atop',
    });
    fabric.Object.prototype.transparentCorners = false;

    // Created the drawable area.
    editor = new fabric.Rect({
        top: defaultSelectedTechnique.availableSections[0].top,
        left: defaultSelectedTechnique.availableSections[0].left,
        width: defaultSelectedTechnique.availableSections[0].width,
        height: defaultSelectedTechnique.availableSections[0].height,
    });

    drawableArea = new fabric.Rect({
        id: 'drawableArea',
        top: defaultSelectedTechnique.availableSections[0].top,
        left: defaultSelectedTechnique.availableSections[0].left,
        width: defaultSelectedTechnique.availableSections[0].width,
        height: defaultSelectedTechnique.availableSections[0].height,
        fill: "transparent",
        stroke: "red",
        strokeWidth: 1,
        strokeDashArray: [10],
        selectable: false,
    });

    qtyProxy['drawableArea'] = drawableArea;
    qtyProxy['canvasEditor'] = editor;
    canvas.clipPath = editor;
    canvas.add(drawableArea);
    mouseZoom();
    undoRedoEventHandler();
}

export function canvasConfigurationChangeHandler(brand: IAvailableSections) {
    // const canvas = qtyProxy.canvas;
    canvas.overlayImage.setSrc(images[brand.defaultImage], canvas.renderAll.bind(canvas));
    const newCoords =  {
        top: brand.top,
        left: brand.left,
        width: brand.width,
        height: brand.height
    }
    editor.set(newCoords);
    drawableArea.set(newCoords);
    qtyProxy['drawableArea'] = drawableArea;
    qtyProxy['canvasEditor'] = editor;
}

// Function to delete selected objects
export const deleteSelectedObjects = () => {
    document.getElementById("deleteButton")?.addEventListener("click", () => {
        const selectedObjects: fabric.Object[] = canvas.getActiveObjects();
        selectedObjects?.forEach((object: fabric.Object) => {
            if (canvas) canvas.remove(object);
        });

        if (canvas) {
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    });
};

export const saveImage = (name = "", type = "image") => {
    name = Date.now();
    const saveButton = document.getElementById('downloadFullImage');
    if (!saveButton) return;

    saveButton.addEventListener('click', () => {
        DownloadImage(name);
        canvas.renderAll();
    });
};

export const clearCanvasHandler = () => {
    getElement("clearCanvas").addEventListener("click", () => {
        if (confirm('Are you sure want to clear canvas?')) {
            [...canvas.getObjects()].forEach((element) => {
                if (element.id !== "drawableArea") {
                    canvas.remove(element);
                }
            });
            document.getElementById(qtyProxy?.selectedProduct?.availableTechniques[0]?.id).click();
            document.querySelectorAll(".step-button")[0].click();
            canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        }
    });
};


export const undoRedoEventHandler = () => {
    
let canvasHistory = {
    state: [JSON.stringify(canvas.toJSON(["id","selectable"]))],
    currentStateIndex: 0,
    undoStatus: false,
    redoStatus: false,
    undoFinishedStatus: true,
    redoFinishedStatus: true,
};

const updateHistory = () => {
    console.log(canvasHistory.undoStatus,"canvasHistory.undoStatus")
    if (canvasHistory.undoStatus === true || canvasHistory.redoStatus === true) {
        console.log('Do not do anything, this got triggered automatically while the undo and redo actions were performed');
    } else {
        const jsonData = canvas.toJSON(["id","selectable"]);
        const canvasAsJson = JSON.stringify(jsonData);

        // NOTE: This is to replace the canvasHistory when it gets rewritten 20180912:Alevale
        if (canvasHistory.currentStateIndex < canvasHistory.state.length - 1) {

            const indexToBeInserted = canvasHistory.currentStateIndex + 1;
            canvasHistory.state[indexToBeInserted] = canvasAsJson;
            const elementsToKeep = indexToBeInserted + 1;
            console.log(`History rewritten, preserved ${elementsToKeep} items`);
            canvasHistory.state = canvasHistory.state.splice(0, elementsToKeep);

        // NOTE: This happens when there is a new item pushed to the canvasHistory (normal case) 20180912:Alevale
        } else {
            console.log('push to canvasHistory');
            canvasHistory.state.push(canvasAsJson);
        }

        canvasHistory.currentStateIndex = canvasHistory.state.length - 1;
        console.log(canvasHistory.state.length,"add history")
    }
};

canvas.on('object:added', () => {
    updateHistory();
});
canvas.on('object:modified', () => {
    updateHistory();
});

// this is only test we remove after functionality done : 
canvas.on("selection:created", ()=> {
    console.log(canvas.getActiveObject() , "active obj")
});
//

const undo = () => {
    // console.log(canvasHistory.state.length, "canvasHistory.state",canvasHistory.currentStateIndex)
    if (canvasHistory.currentStateIndex - 1 === 0) {
        console.log('do not do anything anymore, you are going far to the past, before creation, there was nothing');
        return;
    }
    console.log(canvasHistory.undoFinishedStatus,"canvasHistory.undoFinishedStatus")
    if (canvasHistory.undoFinishedStatus) {
        canvasHistory.undoFinishedStatus = false;
        canvasHistory.undoStatus = true;
        canvasHistory.currentStateIndex--;
        canvas.loadFromJSON(canvasHistory.state[canvasHistory.currentStateIndex], () => {
                console.log(canvas.getObjects(),"canvasHistory.state[canvasHistory.currentStateIndex]")
            canvas.renderAll();
            canvasHistory.undoStatus = false;
            canvasHistory.undoFinishedStatus = true;
        });
    }
};

const redo = () => {
    if (canvasHistory.currentStateIndex + 1 === canvasHistory.state.length) {
        console.log('do not do anything anymore, you do not know what is after the present, do not mess with the future');
        return;
    }

    if (canvasHistory.redoFinishedStatus) {
        canvasHistory.redoFinishedStatus = false;
        canvasHistory.redoStatus = true;
        canvas.loadFromJSON(canvasHistory.state[canvasHistory.currentStateIndex + 1], () => {
            canvas.renderAll();
            canvasHistory.redoStatus = false;
            canvasHistory.currentStateIndex++;
            canvasHistory.redoFinishedStatus = true;
        });
    }
};

  document.getElementById("undo").addEventListener("click", undo);
  document.getElementById("redo").addEventListener("click", redo);
};
  