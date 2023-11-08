import {appendElementWithId} from "../../helpers/helper";
export const  CanvasComponent = () => {
    return `
        <div class="bgImage">
          <div class="canvas-wrapper">
            <canvas id="canvas"></canvas>
          </div>
        </div>`
}
appendElementWithId('content', CanvasComponent())
