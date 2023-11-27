import {downloadImageType} from "../../../assets/config";
import {qtyProxy} from "../../../../index";

export function DownloadImage(name = "", type = "image") {
    const canvas = qtyProxy.canvas;
    let url = "";

    if (type === "json") {
        const canvasData = JSON.stringify(canvas.toJSON());
        const canvasBlob = new Blob([canvasData], { type: "application/json" });
        url = URL.createObjectURL(canvasBlob);
    }

    if (type === "image") {
        url = canvas.toDataURL({
            format: downloadImageType,
        });
    }

    if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();

        // Release the URL object
        URL.revokeObjectURL(url);
    }
}
