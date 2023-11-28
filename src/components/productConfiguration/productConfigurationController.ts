import {qtyProxy} from "../../../index";
import {
    addTextToCanvasHandler,
    changeFontFamilyHandler,
    changeFontSizeHandler, changeTextAlignHandler,
    changeTextColor, editTextHandler, fontBoldUnderlineAndItalicHandler
} from "../productDetail/textController";

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
