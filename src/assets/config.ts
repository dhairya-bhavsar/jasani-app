export const downloadImageType = 'png';
export const maxFileSize = 10;
export const fileTypeSupport = ['application/pdf', 'image/x-eps', 'application/illustrator', 'application/postscript', 'image/jpeg', 'image/jpg', 'image/png'];

export const GoogleFontApi = "https://fonts.googleapis.com/css?family=";
export const APIEndPoint = 'https://jasaniapi.demo.brainvire.dev'; // demo
// export const APIEndPoint = "https://63ce-103-211-14-98.ngrok-free.app"; //local
export const APIVersion = '/api/';
export const GoogleAPIKey = 'AIzaSyCNnUWe_Zp6LRPqvFZP3B6sYJaV98UyJyE';

export const apiUrls = {
    imageConvert: APIEndPoint + APIVersion + 'convert/',
    convertedImage: APIEndPoint + '/media/',
    imageColorReplace : APIEndPoint + APIVersion + 'fill-color/',
    backgroundRemove : APIEndPoint + APIVersion + 'background/',
    adjustPadding : APIEndPoint + APIVersion + 'media/',
    googleFontApi: `https://www.googleapis.com/webfonts/v1/webfonts?key=${GoogleAPIKey}`
}


export const errorMessages = {
    SERVER_ERROR : "Something went wrong contact server team!!",
    PROJECT_SAVED : "Project Save!!!",
    UNDO_FINISH : "Do not do anything anymore, you are going far to the past, before creation, there was nothing",
    REDO_FINISH : "Do not do anything anymore, you do not know what is after the present, do not mess with the future",
    UPLOAD_FILE : "Please upload file",
    LOGO_NOT_PROPER: 'Please upload proper logo file!!',
    LOGO_FILE_GREATER: "File may not be greater than 10 MB",
    LOGO_FORMATE_ISSUE: "Please upload only this file type: jpg, jpeg, png, pdf, eps, ai format",
    OBJ_NOT_SELECTED: "Please select image or text you want to align",
    ALERT_OBJECT_SELECTION: "Please select any object!!",
    CONFIRMATION_MESSAGE: "Are you sure want to delete?",
    CONFIRMATION_BACK_TO_STEP_1: "If you move step 1, it will discard all the changes. Are you sure you want to switch to step 1?"
}

export const Techniques = {
    "Laser Engraving": "LASER_ENGRAVING"
}
