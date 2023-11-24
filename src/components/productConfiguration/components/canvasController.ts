// @ts-nocheck
import {fabric} from "fabric";
import {images} from "../../../assets/images";
import _ from "lodash";
import {qtyProxy} from "../../../../index";
import {IAvailableSections} from "../type";
import {clearInputBoxHandler, getElement} from "../../../helpers/helper";

let canvas, drawableArea;

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
        if (zoom < 0.01) zoom = 0.01;
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
        selection: false
    });
    qtyProxy['canvas'] = canvas;
    canvas.setBackgroundImage(initImage, canvas.renderAll.bind(canvas));
    fabric.Object.prototype.transparentCorners = false;

    // Created the drawable area.
    drawableArea = new fabric.Rect({
        top: 120,
        left: 230,
        width: defaultSelectedTechnique.availableSections[0].width,
        height: defaultSelectedTechnique.availableSections[0].height,
        fill: "transparent",
        stroke: "red",
        strokeWidth: 1,
        strokeDashArray: [10],
        selectable: false,
        clipFor: "editor",
    });

    function findByClipName(name) {
        return _(canvas.getObjects())
            .where({
                clipFor: name,
            })
            .first();
    }

    let clipByName = function (ctx) {
        console.log("ctx", ctx)
        // this.setCoords();
        let clipRect = findByClipName(this.clipName);
        let scaleXTo1 = 1 / this.scaleX;
        let scaleYTo1 = 1 / this.scaleY;
        ctx.save();

        let ctxLeft = -(this.width / 2);
        let ctxTop = -(this.height / 2);

        ctx.translate(ctxLeft, ctxTop);
        ctx.rotate((this.angle * -1 * Math.PI) / 180);
        ctx.scale(scaleXTo1, scaleYTo1);

        let x = this.canvas.viewportTransform;

        ctx.scale(1 / x[0], 1 / x[3]);
        ctx.translate(x[4], x[5]);

        ctx.beginPath();

        ctx.rect(
            x[0] * clipRect.left - this.oCoords.tl.x,
            x[3] * clipRect.top - this.oCoords.tl.y,
            x[0] * clipRect.width,
            x[3] * clipRect.height
        );
        ctx.closePath();
        ctx.restore();
    };

    const text = new fabric.Textbox("dhairya", {
        editable: false,
        borderScaleFactor: 2,
        clipName: "editor",
        clipTo: function (ctx) {
            return _.bind(clipByName, text)(ctx);
        },
    });
    // clearInputBoxHandler("addedText");
    qtyProxy['drawableArea'] = drawableArea;
    canvas.add(drawableArea);
    canvas.add(text);
    text.center();
    mouseZoom();
}


export function canvasConfigurationChangeHandler(brand: IAvailableSections) {
    // const canvas = qtyProxy.canvas;
    canvas.setBackgroundImage(images[brand.defaultImage], canvas.renderAll.bind(canvas));
    drawableArea.set({
        top: brand.top,
        left: brand.left,
        width: brand.width,
        height: brand.height
    });
}


export function addTextToCanvasHandler(canvas) {
    const addTextButton = getElement("applyText");

    addTextButton?.addEventListener("click", () => {
        let addedText = (getElement("addedText") as HTMLInputElement).value;
        if (addedText) {
            const text = new fabric.Textbox(addedText, {
                editable: false,
                borderScaleFactor: 2,
                clipName: "editor",
                clipTo: function (ctx) {
                    return _.bind(clipByName, text)(ctx);
                },
            });
            clearInputBoxHandler("addedText");
            text.center();
            canvas.add(text);
        }
    });
}
