import {qtyProxy} from "../../../../index";

export function tabHideShow() {
    const currentActiveTab = document.querySelector(".tabView.tabShow");
    if (currentActiveTab) {
        currentActiveTab.classList.remove('tabShow');
        currentActiveTab.classList.add('tabHide');
    }
    // @ts-ignore
    const activeNewTab = document.getElementById(qtyProxy.activeTab.toString());
    if (activeNewTab) {
        activeNewTab.classList.remove("tabHide");
        activeNewTab.classList.add("tabShow");
    }
}
export function tabController() {
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

    document.getElementById('nextStepButton').addEventListener("click", () => {
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
    let saveButtonAction = function remove() {}
    const nextButton = document.getElementById('nextStepButton');
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveButtonAction);
    if (qtyProxy["activeTab"] !== 4) {
        nextButton.classList.remove('hidden');
        saveButton.classList.add('hidden');
        return;
    }
    nextButton.classList.add('hidden');
    saveButton.classList.remove('hidden');
    // TODO: need to check multiple time binding click event.
    saveButtonAction = function save() {
        alert('Project Save!!!');
    }
    saveButton.addEventListener('click', saveButtonAction);
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