import {apiUrls, fileTypeSupport, maxFileSize} from "../../../assets/config";

export function uploadLogo(event) {
    const files = event.target.files;
    if (!files || files.length === 0) alert('Please upload file');
    if (!validateImage(files[0])) {
        console.log("file unsupported format!!");
        return;
    }

    const requestObj = new FormData();
    requestObj.append('file', files[0]);
    fetch(apiUrls.imageConvert, {
        method: "POST",
        body: requestObj,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("data", data);
            // addApiImageToCanvas(canvas, data.data.image);
            // detectedColorsAndSetHandler(data.data.colors);
        })
        .catch((error) => {
            // Handle errors here
            console.error("Error:", error);
        });
}

function validateImage(file) {
    if (file) {
        // @ts-ignore
        if (fileTypeSupport.includes(file.type)) {
            const size = file.size / 10024 / 10024;
            if (size > maxFileSize ) {
                alert('File may not be greater than 10 MB');
                return true
            }
        }
        alert('Please upload only this file type: pdf, eps, ai format');
        return false;
    }
    return false;
}

export function initUploadLogoButton() {
    const btn = document.getElementById('uploadLogo');
    if(!btn) return;
    btn.addEventListener('change', uploadLogo);
}
