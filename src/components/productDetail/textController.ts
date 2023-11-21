import { fabric } from "fabric";

export function addTextToCanvasHandler(canvas) {
  const addTextButton = document.getElementById("applyText");

  addTextButton?.addEventListener("click", () => {
    let addedText = (document.getElementById("addedText") as HTMLInputElement)
      .value;
    if (addedText) {
      const text = new fabric.Textbox(addedText, {
        top: 20,
      });
      (document.getElementById("addedText") as HTMLInputElement).value = "";
      canvas.add(text);
    }
  });
}

export const changeFontFamilyHandler = (canvas) => {
  const fontType = document.getElementById("fontType") as HTMLSelectElement;

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
      }
      canvas.renderAll();
    });
  }
};

export const changeFontSizeHandler = (canvas) => {
  const fontSize = document.getElementById("fontSize") as HTMLInputElement;

  const updateInpuBoxValue = (e) => {
    fontSize.value = e.selected[0].fontSize;
  };

  const onDeselectHandler = () => {
    fontSize.value = "40";
  };

  canvasSelectEventHandler(canvas, updateInpuBoxValue, onDeselectHandler);

  ["keyup", "change"].forEach((eventName) => {
    fontSize.addEventListener(eventName, (event) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject instanceof fabric.Text) {
        activeObject.set("fontSize", +(event.target as HTMLInputElement).value);
        selectedTextBoxStyleHelper("fontSize", activeObject);
      }
      canvas.renderAll();
    });
  });
};

export const fontBoldUnderlineAndItalicHandler = (canvas) => {
  const styleHelperArray = ["fontStyle", "fontWeight", "textDecoration"];
  const boldCheckbox = document.getElementById("fontBold") as HTMLInputElement;
  const italicCheckbox = document.getElementById(
    "fontItalic"
  ) as HTMLInputElement;
  const underlineCheckbox = document.getElementById(
    "fontUnderline"
  ) as HTMLInputElement;

  const boldLabel = document.getElementById("boldFontLabel");
  const italicLabel = document.getElementById("italicFontLabel");
  const underlineLabel = document.getElementById("underlineFontLabel");

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

      boldLabel.classList.toggle("active", isBold);
      italicLabel.classList.toggle("active", isItalic);
      underlineLabel.classList.toggle("active", isUnderline);
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
    boldCheckbox.checked = false;
    italicCheckbox.checked = false;
    underlineCheckbox.checked = false;
    boldLabel.classList.remove("active");
    italicLabel.classList.remove("active");
    underlineLabel.classList.remove("active");
  };

  canvasSelectEventHandler(canvas, updateCheckboxes, onDeselectHandler);

  [boldCheckbox, italicCheckbox, underlineCheckbox].forEach((checkbox) => {
    checkbox.addEventListener("change", updateFontStyles);
  });
};

export const changeTextColor = (canvas) => {
  const textColorInputbox = document.getElementById(
    "textColor"
  ) as HTMLInputElement;

  const updateInpuBoxValue = (e) => {
    textColorInputbox.value = e.selected[0].fill;
  };

  const onDeselectHandler = () => {
    textColorInputbox.value = "black";
  };

  canvasSelectEventHandler(canvas, updateInpuBoxValue, onDeselectHandler);

  textColorInputbox?.addEventListener("input", () => {
    const selectedObjects = canvas.getActiveObjects();

    const newColor = (document.getElementById("textColor") as HTMLInputElement)
      .value;

    if (newColor) {
      selectedObjects.forEach((object) => {
        if (object.type === "textbox") {
          object.set("fill", newColor);
          selectedTextBoxStyleHelper("color", object);
        }
      });

      canvas.renderAll();
    }
  });
};

export const changeTextAlignHandler = (canvas) => {
  const textAlign = document.getElementById("textAlign") as HTMLSelectElement;
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
      }
      canvas.renderAll();
    });
  }
};

/*
 * style : the name of css property you need to update
 * activeObject : selected textBox
 */
const selectedTextBoxStyleHelper = (style, activeObject) => {
  const selectedTextBox = document.getElementById(
    "selectedText"
  ) as HTMLInputElement;
  switch (style) {
    case "textAlign":
      selectedTextBox.style.textAlign = activeObject.textAlign;
      break;
    case "fontFamily":
      selectedTextBox.style.fontFamily = activeObject.fontFamily;
      break;
    case "fontSize":
      selectedTextBox.style.fontSize = `${activeObject.fontSize}px`;
      break;
    case "color":
      selectedTextBox.style.color = activeObject.fill;
      break;
    case "fontStyle":
      selectedTextBox.style.fontStyle = activeObject.fontStyle;
      break;
    case "fontWeight":
      selectedTextBox.style.fontWeight = activeObject.fontWeight;
      break;
    case "textDecoration":
      selectedTextBox.style.textDecoration = activeObject.underline
        ? "underline"
        : "none";
      break;
    default:
      return;
  }
};

export const editTextHandler = (canvas) => {
  const styleHelperArray = [
    "textAlign",
    "fontFamily",
    "fontSize",
    "color",
    "fontStyle",
    "fontWeight",
    "textDecoration",
  ];
  const selectedTextBox = document.getElementById(
    "selectedText"
  ) as HTMLInputElement;

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
    selectedTextBox.value = "";
  };

  canvasSelectEventHandler(canvas, addTextToSelectedTextBox, onDeselectHandler);

  ["keyup", "change"].forEach((eventName) => {
    selectedTextBox.addEventListener(eventName, (event) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject instanceof fabric.Text) {
        activeObject.set("text", (event.target as HTMLInputElement).value);
      }
      canvas.renderAll();
    });
  });
};

/*
 * canvas : selection area canvas
 * updateFunction : the function you need to call when the textbox selection change
 */
export const canvasSelectEventHandler = (
  canvas,
  updateFunction,
  clearFunction: () => void
) => {
  const selectedTextBox = document.getElementById("selectedText");

  canvas.on("selection:updated", (e) => {
    if (e.selected[0].text) {
      selectedTextBox.style.display = "block";
      updateFunction(e);
    } else {
      clearFunction();
    }
  });

  canvas.on("selection:created", (e) => {
    if (e.selected[0].text) {
      selectedTextBox.style.display = "block";
      updateFunction(e);
    } else {
      clearFunction();
    }
  });

  canvas.on("selection:cleared", () => {
    clearFunction();
  });
};
