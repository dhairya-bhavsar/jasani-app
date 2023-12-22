import { qtyProxy } from "../../../..";
import {apiUrls, errorMessages, GoogleFontApi} from "../../../assets/config";
import { setLoader } from "../../../helpers/helper";
import { selectedTextBoxStyleHelper } from "../../productDetail/textController";
import WebFont from "webfontloader";

export async function getFontData(): Promise<void> {
  setLoader(true);
  try {
    const response = await fetch(apiUrls.googleFontApi);
    const data = await response.json();
    qtyProxy["fontList"] = data?.items;
    // TODO: drop-down for the google font API.
    // data?.items?.forEach((font) => {
    //   const url = GoogleFontApi + font.family.replaceAll(" ", "-").replace(/ /g, "+") + ":" + "&display=swap";
    //   document.head.append(
    //       new DOMParser().parseFromString(
    //           `<link rel="stylesheet" href=${url} type="text/css"/>`,
    //           "text/html"
    //       ).head.firstChild
    //   );
    // });
    //
    // setTimeout(() => {
      setLoader(false);
    // }, 15000)
  } catch (error) {
    console.log("Google Font API fetching Error!!!");
    alert(errorMessages.SERVER_ERROR);
    setLoader(false);
  }
}

export function applyGoogleFontHandler(font, activeObject): void {
  qtyProxy["addedFontList"] = qtyProxy?.addedFontList || ["Times New Roman"];

  if (!font && !activeObject) return;

  if (!qtyProxy.addedFontList.includes(font)) {
    const url = GoogleFontApi + font.replace(/ /g, "+") + ":" + "&display=swap";
    document.head.append(
      new DOMParser().parseFromString(
        `<link rel="stylesheet" href=${url} type="text/css"/>`,
        "text/html"
      ).head.firstChild
    );
    qtyProxy.addedFontList.push(font);
  }

  setLoader(true);
  WebFont.load({
    google: {
      families: qtyProxy?.addedFontList,
    },
    active: function () {
      activeObject.set("fontFamily", font);
      selectedTextBoxStyleHelper("fontFamily", activeObject);
      qtyProxy.canvas.fire("object:modified");
      qtyProxy?.canvas.renderAll();
      setLoader(false);
    },
  });
}
