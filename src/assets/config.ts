export const downloadImageType = 'png';
export const maxFileSize = 10;
export const fileTypeSupport = ['application/pdf', 'image/x-eps', 'application/illustrator', 'application/postscript', 'image/jpeg', 'image/jpg', 'image/png'];
export const APIEndPoint = "https://jasaniapi.demo.brainvire.dev"; // demo
// export const APIEndPoint = "https://0150-180-211-97-51.ngrok-free.app"; //local
export const APIVersion = '/api/';

export const apiUrls = {
    imageConvert: APIEndPoint + APIVersion + 'convert/',
    convertedImage: APIEndPoint + '/media/',
    imageColorReplace : APIEndPoint + APIVersion + 'fill-color/',
    backgroundRemove : APIEndPoint + APIVersion + 'background/'
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

}
