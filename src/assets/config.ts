export const downloadImageType = 'png';
export const maxFileSize = 10;
export const fileTypeSupport = ['application/pdf', 'image/x-eps', 'application/illustrator', 'application/postscript', 'image/jpeg', 'image/jpg', 'image/png'];
export const APIEndPoint = "https://jasaniapi.demo.brainvire.dev"; // demo
// export const APIEndPoint = "https://0150-180-211-97-51.ngrok-free.app"; //local
export const APIVersion = '/api/';

export const apiUrls = {
    imageConvert: APIEndPoint + APIVersion + 'convert/',
    convertedImage: APIEndPoint + '/media/',
    imageColorReplace : APIEndPoint + APIVersion + 'fill-color/'
}
