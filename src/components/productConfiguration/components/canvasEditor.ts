import {IAvailableTechniques} from "../type";
import {initCanvas} from "./canvasController";

export const CanvasEditor = (defaultSelectedTechnique: IAvailableTechniques) => {

    setTimeout(() => {
        initCanvas(defaultSelectedTechnique);
    },0)

    return `
        <section class="product-canvas">
            <div class="canvas-editor-wrapper">
                <canvas id="productCanvas" width="500" height="500"></canvas>
            </div>
        </section>
    `
}
