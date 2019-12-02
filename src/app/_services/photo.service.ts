import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileUploadOptions } from '@ionic-native/file-transfer';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class CameraService { 

    private cameraOptions: CameraOptions = {
        quality: 100,
        destinationType: this.cameraNative.DestinationType.FILE_URI,
        encodingType: this.cameraNative.EncodingType.JPEG,
        mediaType: this.cameraNative.MediaType.PICTURE
    }
    
    constructor(
        private cameraNative: Camera,
        private auth: OAuthService) { }
        
    /**
     * Take a picture or video, or load one from the library.
     * @param {CameraOptions} [options] (Optional) Options that you want to pass to the camera. Encoding type, quality, etc. Platform-specific quirks are described in the [Cordova plugin docs](https://github.com/apache/cordova-plugin-camera#cameraoptions-errata-).
     * @returns {Promise<any>} Returns a Promise that resolves with Base64 encoding of the image data, or the image file URI, depending on cameraOptions, otherwise rejects with an error.
     */
    camera(option?: CameraOptions): Promise<any> {
        if (option) {
            return this.cameraNative.getPicture(option);
        }

        return this.cameraNative.getPicture(this.cameraOptions);
    }

    options(image: any) {
        var token = this.auth.getAccessToken();

        let options: FileUploadOptions = {
            fileKey: "file",
            fileName: Date.now().toString() + "_" + image.substr(image.lastIndexOf('/') + 1),
            mimeType: "image/jpeg",
            headers: { 'Authorization': 'Bearer ' + token }
        };

        return options;
    }
}