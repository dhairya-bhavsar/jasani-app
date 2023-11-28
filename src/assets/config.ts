export const downloadImageType = 'png';
export const maxFileSize = 10;
export const fileTypeSupport = ['application/pdf', 'image/x-eps', 'application/illustrator'];
export const APIEndPoint = "http://192.168.10.7:3338";
export const APIVersion = '/api/';

export const apiUrls = {
    imageConvert: APIEndPoint + APIVersion + 'convert/',
    convertedImage: APIEndPoint + '/media/',
    imageColorReplace : APIEndPoint + APIVersion + 'fill-color/'
}
