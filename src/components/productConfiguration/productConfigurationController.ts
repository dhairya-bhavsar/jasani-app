import {qtyProxy} from "../../../index";
import {
    addTextToCanvasHandler,
    changeFontFamilyHandler,
    changeFontSizeHandler, changeTextAlignHandler,
    changeTextColor, editTextHandler, fontBoldUnderlineAndItalicHandler
} from "../productDetail/textController";
import {CheckTechniqueGradientSupport, CheckTechniqueSingleColor} from "./util";
import {errorMessages} from "../../assets/config.ts";

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

    // To add the waring message based on the technique on load.
    const noteEL = document.getElementById('noteMessage');
    if (CheckTechniqueGradientSupport()) {
        if (!noteEL) return;
        noteEL.classList.remove('hidden')
        noteEL.innerHTML = errorMessages.NOTE_MESSAGE_TECHNIQUE;
    }
}

export function ObserveTechniqueChange() {
    const techniqueName = document.getElementById('selectedTechniqueName');
    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                const textColorInputbox = document.getElementById("textColor") as HTMLInputElement;
                const noteEL = document.getElementById('noteMessage');
                if (!noteEL.className.includes('hidden')) noteEL.classList.add('hidden')

                textColorInputbox.disabled = CheckTechniqueSingleColor();
                if (CheckTechniqueGradientSupport()) {
                    if (!noteEL) return;
                    noteEL.classList.remove('hidden')
                    noteEL.innerHTML = errorMessages.NOTE_MESSAGE_TECHNIQUE;
                }
            }
        }

    };

    const observer = new MutationObserver(callback);
    observer.observe(techniqueName, config);
}
