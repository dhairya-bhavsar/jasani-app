import { downloadImageType } from "../../../assets/config";
import { qtyProxy } from "../../../../index";

export function DownloadImage(name = "", type = "image", isDownload = true) {
  const canvas = qtyProxy.canvas;
  let url = "";

  const drawableArea = qtyProxy?.drawableArea;

  drawableArea.set("stroke", "transparent");
  const previousValue = [...canvas.viewportTransform];
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

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

  if (!isDownload) {
    canvas.setViewportTransform(previousValue);
    drawableArea.set("stroke", "red");
    canvas.renderAll()
    return url;
  }

  if (url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    canvas.setViewportTransform(previousValue);
    drawableArea.set("stroke", "red");
    canvas.renderAll();

    // Release the URL object
    URL.revokeObjectURL(url);
  }
}
