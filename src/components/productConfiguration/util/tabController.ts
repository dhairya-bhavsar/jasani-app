import {qtyProxy} from "../../../../index";
import { errorMessages } from "../../../assets/config";
import { findLogoCordsHelper } from "./logoSizeEstimator";

export function tabHideShow() {
    const currentActiveTab = document.querySelector(".tabView.tabShow");
    if (currentActiveTab) {
        currentActiveTab.classList.remove('tabShow');
        currentActiveTab.classList.add('tabHide');
    }

    const activeNewTab = document.getElementById(qtyProxy.activeTab.toString());
    if (activeNewTab) {
        activeNewTab.classList.remove("tabHide");
        activeNewTab.classList.add("tabShow");
    }

    if (qtyProxy?.activeTab == 4) {
        findLogoCordsHelper()
    }
}
export function tabController() {
    // TODO: Tab selection step changes.

    // document.querySelectorAll(".step-button").forEach((ele) => {
    //     ele.addEventListener("click", () => {
    //         const active = document.querySelector(".step-button.active");
    //         if (active) active.classList.remove("active");
    //         ele.classList.add("active");
    //         // @ts-ignore
    //         qtyProxy['activeTab'] = +ele.name;
    //         tabHideShow();
    //         saveButtonAction();
    //     });
    // });

    const nextStepButton = document.getElementById('nextStepButton');
    if (!nextStepButton) return;

    nextStepButton.addEventListener("click", () => {
        let id = qtyProxy?.activeTab || 1;
        id += 1
        const active = document.querySelector(".step-button.active");
        if (active) active.classList.remove("active");
        const nextButton = document.getElementsByName(id)[0];
        if (nextButton) nextButton.classList.add("active");
        if (id < 5) qtyProxy["activeTab"] = id;
        tabHideShow();
        saveButtonAction();
        qtyProxy?.canvas?.discardActiveObject().renderAll();
    });
}

export function saveButtonAction() {
    const nextButton = document.getElementById('nextStepButton');
    const saveButton = document.getElementById('saveButton');
    if (qtyProxy["activeTab"] !== 4) {
        nextButton?.classList.remove('hidden');
        saveButton?.classList.add('hidden');
        return;
    }
    nextButton?.classList.add('hidden');
    saveButton?.classList.remove('hidden');

    const saveButtonAction = function save() {
        alert(errorMessages.PROJECT_SAVED);
        saveButton.removeEventListener("click",saveButtonAction);
    };
    saveButton.addEventListener('click', function () {
        saveButtonAction();
    });
}


const manualStepClickEventHandler = (event) => {
    const active = document.querySelector(".step-button.active");
    if (active) active.classList.remove("active");
    event.target.classList.add("active");
    qtyProxy['activeTab'] = +event.target.name;
    tabHideShow();
    saveButtonAction();
    event.target.removeEventListener("click",manualStepClickEventHandler);
};

export const clickStepBtnHandler = (btnIndex) =>{
    const step1Btn = document.querySelectorAll(".step-button")[btnIndex];
    step1Btn.addEventListener("click",manualStepClickEventHandler);
    //@ts-ignore
    step1Btn.click();
}
