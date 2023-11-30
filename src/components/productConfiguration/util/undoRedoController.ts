import {qtyProxy} from "../../../../index";

function updateHistory() {
  let canvas = qtyProxy?.canvas;
  let canvasHistory = JSON.parse(JSON.stringify(qtyProxy?.updatedHistory));

  if (canvasHistory.undoStatus === true || canvasHistory.redoStatus === true) {
    console.log(
      "Do not do anything, this got triggered automatically while the undo and redo actions were performed"
    );
  } else {
    const jsonData = canvas.toJSON(["id", "selectable"]);
    const canvasAsJson = JSON.stringify(jsonData);

    // NOTE: This is to replace the canvasHistory when it gets rewritten 20180912:Alevale
    if (canvasHistory.currentStateIndex < canvasHistory.state.length - 1) {
      const indexToBeInserted = canvasHistory.currentStateIndex + 1;
      canvasHistory.state[indexToBeInserted] = {
        canvasJson: canvasAsJson,
        PreLogoList: qtyProxy?.logoList,
      };
      const elementsToKeep = indexToBeInserted + 1;
      canvasHistory.state = canvasHistory.state.splice(0, elementsToKeep);

      // NOTE: This happens when there is a new item pushed to the canvasHistory (normal case) 20180912:Alevale
    } else {
      canvasHistory.state.push({
        canvasJson: canvasAsJson,
        PreLogoList: qtyProxy?.logoList,
      });
    }

    canvasHistory.currentStateIndex = canvasHistory.state.length - 1;
    qtyProxy["updatedHistory"] = canvasHistory;
  }
}

function undo() {
  let canvas = qtyProxy?.canvas;
  let canvasHistory = JSON.parse(JSON.stringify(qtyProxy?.updatedHistory));
  if (canvasHistory.currentStateIndex - 1 <= 0) {
    alert(
      "do not do anything anymore, you are going far to the past, before creation, there was nothing"
    );
    return;
  }
  if (canvasHistory.undoFinishedStatus) {
    canvasHistory.undoFinishedStatus = false;
    canvasHistory.undoStatus = true;
    canvasHistory.currentStateIndex--;
    canvas.loadFromJSON(
      canvasHistory.state[canvasHistory.currentStateIndex].canvasJson,
      () => {
        qtyProxy["logoList"] =
          canvasHistory.state[canvasHistory.currentStateIndex].PreLogoList;
        canvas.renderAll();
        canvasHistory.undoStatus = false;
        canvasHistory.undoFinishedStatus = true;
        qtyProxy["updatedHistory"] = canvasHistory;
      }
    );
  }
}

function redo() {
  let canvas = qtyProxy?.canvas;
  let canvasHistory = JSON.parse(JSON.stringify(qtyProxy?.updatedHistory));
  if (canvasHistory.currentStateIndex + 1 === canvasHistory.state.length) {
    alert(
      "do not do anything anymore, you do not know what is after the present, do not mess with the future"
    );
    return;
  }

  if (canvasHistory.redoFinishedStatus) {
    canvasHistory.redoFinishedStatus = false;
    canvasHistory.redoStatus = true;
    canvas.loadFromJSON(
      canvasHistory.state[canvasHistory.currentStateIndex + 1].canvasJson,
      () => {
        qtyProxy["logoList"] =
          canvasHistory.state[canvasHistory.currentStateIndex + 1].PreLogoList;
        canvas.renderAll();
        canvasHistory.redoStatus = false;
        canvasHistory.currentStateIndex++;
        canvasHistory.redoFinishedStatus = true;
        qtyProxy["updatedHistory"] = canvasHistory;
      }
    );
  }
}

export const initUndoRedoEventHandler = () => {
  let canvas = qtyProxy?.canvas;
  qtyProxy["updatedHistory"] = JSON.parse(
    JSON.stringify(qtyProxy.initialHistory)
  );
  canvas.off("object:added", updateHistory);
  canvas.off("object:modified", updateHistory);

  canvas.on("object:added", updateHistory);
  canvas.on("object:modified", updateHistory);

  document.getElementById("undo").addEventListener("click", undo);
  document.getElementById("redo").addEventListener("click", redo);
};
