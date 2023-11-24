import {qtyProxy} from "../../../index";
import {
    changeFontFamilyHandler,
    changeFontSizeHandler, changeTextAlignHandler,
    changeTextColor, editTextHandler, fontBoldUnderlineAndItalicHandler
} from "../productDetail/textController";
import {addTextToCanvasHandler} from "./components/canvasController";

export function textEditorInitial() {
    const canvas = qtyProxy.canvas;

    addTextToCanvasHandler(canvas);
    changeTextColor(canvas);
    changeFontFamilyHandler(canvas);
    changeFontSizeHandler(canvas);
    fontBoldUnderlineAndItalicHandler(canvas);
    editTextHandler(canvas);
    changeTextAlignHandler(canvas);
}
