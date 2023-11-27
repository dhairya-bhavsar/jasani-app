// @ts-nocheck
import {fabric} from "fabric";
import {images} from "../../../assets/images";
import {qtyProxy} from "../../../../index";
import {IAvailableSections} from "../type";
import {downloadImageType} from "../../../assets/config";
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
        drawableArea.set("stroke", "transparent");
        const previousValue = [...canvas.viewportTransform];
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        DownloadImage(name);
        canvas.setViewportTransform(previousValue);
        drawableArea.set("stroke", "red");
        canvas.renderAll();
    });
};

export const clearCanvasHandler = () => {
    getElement("clearCanvas").addEventListener("click", () => {
        if (confirm('Are you sure want to clear canvas?')) {
            console.log("ca", canvas.getObjects());
            [...canvas.getObjects()].forEach((element) => {
                if (element.id !== "drawableArea") {
                    canvas.remove(element);
                }
            });
        }
    });
};
