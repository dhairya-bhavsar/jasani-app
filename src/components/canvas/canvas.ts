import {TitleComponent} from "../title/title";

export const  CanvasComponent = () => {
    return `
        <section>
            ${TitleComponent({title: "Canvas", backNode: true})}
          <div class="canvas-wrapper">
            Canvas
          </div>
        </section
    >`
}

