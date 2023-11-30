// @ts-nocheck
import { fabric } from "fabric";
import { clearInputBoxHandler, getElement } from "../../helpers/helper";
import {qtyProxy} from "../../../index.ts";
import { clickStepBtnHandler } from "../productConfiguration/util";

export function addTextToCanvasHandler(canvas) {
  const addTextButton = getElement("applyText");

  addTextButton?.addEventListener("click", () => {
    let addedText = (getElement("addedText") as HTMLInputElement).value;
    if (addedText) {
      const text = new fabric.Textbox(addedText, {
        editable: false,
        transparentCorners : false,
        borderScaleFactor: 2,
      });
      const editor = qtyProxy.canvasEditor;
      const top = editor.top + (editor.height - text.height) / 2;
      const left = editor.left + (editor.width - text.width) / 2;

      text.set({
        top: top,
        left: left
      })
      clearInputBoxHandler("addedText");
      text.center();
      canvas.add(text);
    }
  });
}

export const changeFontFamilyHandler = (canvas) => {
  const fontType = getElement("fontType") as HTMLSelectElement;

  const updateDropdpwnValue = (e) => {
    fontType.value = e.selected[0].fontFamily;
  };

  const onDeselectHandler = () => {
    fontType.value = "Times New Roman";
  };

  canvasSelectEventHandler(canvas, updateDropdpwnValue, onDeselectHandler);

  if (fontType) {
    fontType.addEventListener("change", () => {
      const activeObject = canvas.getActiveObject();

      if (activeObject instanceof fabric.Text) {
        activeObject.set("fontFamily", fontType.value);
        selectedTextBoxStyleHelper("fontFamily", activeObject);
        canvas.fire('object:modified');
      }
      canvas.renderAll();
    });
  }
};

export const changeFontSizeHandler = (canvas) => {
  const fontSize = getElement("fontSize") as HTMLInputElement;

  const updateInpuBoxValue = (e) => {
    fontSize.value = e.selected[0].fontSize;
  };

  const onDeselectHandler = () => {
    fontSize.value = "40";
  };

  canvasSelectEventHandler(canvas, updateInpuBoxValue, onDeselectHandler);

  fontSize.addEventListener("input", (event) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject instanceof fabric.Text) {
      activeObject.set("fontSize", +(event.target as HTMLInputElement).value);
      canvas.fire('object:modified');
    }
    canvas.renderAll();
  });
};

export const fontBoldUnderlineAndItalicHandler = (canvas) => {
  const styleHelperArray = ["fontStyle", "fontWeight", "textDecoration"];
  const boldCheckbox = getElement("fontBold") as HTMLInputElement;
  const italicCheckbox = getElement("fontItalic") as HTMLInputElement;
  const underlineCheckbox = getElement("fontUnderline") as HTMLInputElement;

  const boldLabel = getElement("boldFontLabel");
  const italicLabel = getElement("italicFontLabel");
  const underlineLabel = getElement("underlineFontLabel");

  const checkBoxesAndLabels = [
    { checkBox: boldCheckbox, label: boldLabel },
    { checkBox: italicCheckbox, label: italicLabel },
    { checkBox: underlineCheckbox, label: underlineLabel },
  ];

  const updateFontStyles = () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject instanceof fabric.Text) {
      const isBold = boldCheckbox.checked;
      const isItalic = italicCheckbox.checked;
      const isUnderline = underlineCheckbox.checked;
      activeObject.set({
        fontWeight: isBold ? "bold" : "100",
        fontStyle: isItalic ? "italic" : "normal",
        underline: isUnderline,
      });

      styleHelperArray.forEach((style) => {
        selectedTextBoxStyleHelper(style, activeObject);
      });

      checkBoxesAndLabels.forEach(({ checkBox, label }) => {
        label.classList.toggle("active", checkBox.checked);
      });
      canvas.fire('object:modified');
    }

    canvas.renderAll();
  };

  const updateCheckboxes = (e) => {
    boldCheckbox.checked = e.selected[0].fontWeight === "bold";
    italicCheckbox.checked = e.selected[0].fontStyle === "italic";
    underlineCheckbox.checked = e.selected[0].underline;
    boldLabel.classList.toggle("active", e.selected[0].fontWeight === "bold");
    italicLabel.classList.toggle(
      "active",
      e.selected[0].fontStyle === "italic"
    );
    underlineLabel.classList.toggle("active", e.selected[0].underline);
  };

  const onDeselectHandler = () => {
    checkBoxesAndLabels.forEach(({ checkBox, label }) => {
      checkBox.checked = false;
      label.classList.remove("active");
    });
  };

  canvasSelectEventHandler(canvas, updateCheckboxes, onDeselectHandler);

  checkBoxesAndLabels.forEach(({ checkBox }) => {
    checkBox.addEventListener("change", updateFontStyles);
  });
};

export const changeTextColor = (canvas) => {
  const textColorInputbox = getElement("textColor") as HTMLInputElement;

  const updateInpuBoxValue = (e) => {
    textColorInputbox.value = e.selected[0].fill;
  };

  const onDeselectHandler = () => {
    textColorInputbox.value = "black";
  };

  canvasSelectEventHandler(canvas, updateInpuBoxValue, onDeselectHandler);

  textColorInputbox?.addEventListener("input", () => {
    const activeObject = canvas.getActiveObject();
    const newColor = (getElement("textColor") as HTMLInputElement).value;

    if (newColor && activeObject instanceof fabric.Text) {
      activeObject.set("fill", newColor);
      selectedTextBoxStyleHelper("color", activeObject);
      canvas.renderAll();
    }
  });

  textColorInputbox?.addEventListener("change",()=>{
    canvas.fire('object:modified');
  })
};

export const changeTextAlignHandler = (canvas) => {
  const textAlign = getElement("textAlign") as HTMLSelectElement;
  const updateDropdpwnValue = (e) => {
    textAlign.value = e.selected[0].textAlign;
  };

  const onDeselectHandler = () => {
    textAlign.value = "left";
  };

  canvasSelectEventHandler(canvas, updateDropdpwnValue, onDeselectHandler);

  if (textAlign) {
    textAlign.addEventListener("change", () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject instanceof fabric.Text) {
        activeObject.set("textAlign", textAlign.value);
        selectedTextBoxStyleHelper("textAlign", activeObject);
        canvas.fire('object:modified');
      }
      canvas.renderAll();
    });
  }
};

/*
 * style : the name of the CSS property you need to update
 * activeObject : selected textBox
 */
const selectedTextBoxStyleHelper = (style, activeObject) => {
  const selectedTextBox = getElement("selectedText") as HTMLInputElement;
  const styleMap = {
    textAlign: "textAlign",
    fontFamily: "fontFamily",
    color: "fill",
    fontStyle: "fontStyle",
    fontWeight: "fontWeight",
    textDecoration: (value) => (value ? "underline" : "none"),
  };

  const property = styleMap[style];
  if (property) {
    let value;

    if (typeof property === "function") {
      value = property(
        activeObject[style === "textDecoration" ? "underline" : style]
      );
    } else {
      value = activeObject[property];
    }
    selectedTextBox.style[style] = value;
  }
};

export const editTextHandler = (canvas) => {
  const styleHelperArray = [
    "textAlign",
    "fontFamily",
    "color",
    "fontStyle",
    "fontWeight",
    "textDecoration",
  ];
  const selectedTextBox = getElement("selectedText") as HTMLInputElement;

  const addTextToSelectedTextBox = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject instanceof fabric.Text) {
      selectedTextBox.value = activeObject.text;
      styleHelperArray.forEach((style) => {
        selectedTextBoxStyleHelper(style, activeObject);
      });
    }
  };

  const onDeselectHandler = () => {
    selectedTextBox.style.display = "none";
    clearInputBoxHandler("selectedText");
  };

  canvasSelectEventHandler(canvas, addTextToSelectedTextBox, onDeselectHandler);

  selectedTextBox.addEventListener("input", (event) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject instanceof fabric.Text) {
      activeObject.set("text", (event.target as HTMLInputElement).value);
      canvas.renderAll();
    }
  });
};

/*
 * canvas : selection area canvas
 * updateFunction : the function you need to call when the textbox selection changes
 */
export const canvasSelectEventHandler = (
  canvas,
  updateFunction,
  clearFunction
) => {
  const selectedTextBox = getElement("selectedText");

  const handleSelection = (e) => {
    const hasSelectedText = e.selected[0]?.text;
    selectedTextBox.style.display = hasSelectedText ? "block" : "none";
    hasSelectedText ? updateFunction(e) : clearFunction();
    clickStepBtnHandler(2);
  };

  canvas.on("selection:updated", handleSelection);
  canvas.on("selection:created", handleSelection);
  canvas.on("selection:cleared", clearFunction);
};
