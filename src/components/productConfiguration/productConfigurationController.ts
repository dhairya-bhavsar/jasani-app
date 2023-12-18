import {qtyProxy} from "../../../index";
import {
    addTextToCanvasHandler,
    changeFontFamilyHandler,
    changeFontSizeHandler, changeTextAlignHandler,
    changeTextColor, editTextHandler, fontBoldUnderlineAndItalicHandler
} from "../productDetail/textController";
import {CheckTechniqueSingleColor} from "./util";

export function textEditorInitial() {
    const canvas = qtyProxy.canvas;

    addTextToCanvasHandler(canvas);
    changeTextColor(canvas);
    changeFontFamilyHandler(canvas);
    changeFontSizeHandler(canvas);
    fontBoldUnderlineAndItalicHandler(canvas);
    editTextHandler(canvas);
    changeTextAlignHandler(canvas);
    ObserveTechniqueChange();
}

export function ObserveTechniqueChange() {
    const techniqueName = document.getElementById('selectedTechniqueName');
    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                const textColorInputbox = document.getElementById("textColor") as HTMLInputElement;
                textColorInputbox.disabled = CheckTechniqueSingleColor();
            }
        }

    };

    const observer = new MutationObserver(callback);
    observer.observe(techniqueName, config);
}
