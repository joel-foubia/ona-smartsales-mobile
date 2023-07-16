import { Injectable } from '@angular/core';
//import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';


@Injectable()
export class ImageProvider {

  private photos;

  constructor(private crop: Crop, private camera: Camera) {}

  /**
   * Cette fonction permet de récupérer
   * les images qui sont stockées via Firebase
   *
   * @param url string, url de l'image
   * @param imgSrc string, 
   **/
  getImageReadable(url, imgSrc) {

    firebase.storage().refFromURL(url).getDownloadURL()
      .then(response => imgSrc = response)
      .catch(error => console.log('error', error));
  }

  getCallbackURL(url, callback){

    return firebase.storage().refFromURL(url).getDownloadURL()
                  .then(response => {
                      callback(response);
                  })
                  .catch(error => console.log('error', error));
  }

  /**
   * Cette fonction permet de récupérer
   * une photo depuis la gallerie d'image
   *
   **/
  openImagePicker(){
    
    return new Promise((resolve, reject) => {

      let options =  {
        destinationType: 0,
        sourceType: 0,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true
      };
      
      this.camera.getPicture(options).then((data) => {

        resolve(data);
     
      }, function(error) {
        console.log(error);
        reject(error);
      });

  });
    
  }

/**
 * Cette fonction permet de faire un crop sur
 * une image
 *
 **/
reduceImages(selected_pictures: any) {

    return selected_pictures.reduce((promise:any, item:any) => {
      
      return promise.then((result) => {

        return this.crop.crop(item).then((cropped_image) => {
            
            this.photos.push(cropped_image)
        });

      });
    }, Promise.resolve());
}


/**
 * Cette fonction permet à un utilisateur 
 * de prendre une photo à partir de la caméra de l'appareil
 *
 **/
takePicture(){
  
  return new Promise((resolve, reject) => {

      let options =  {
        destinationType: 0,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true
      };
      
      this.camera.getPicture(options).then((data) => {

        resolve(data);
        //this.photos = new Array<string>();
        /*this.crop.crop(data)
          .then((newImage) => {
            
            this.photos.push(newImage);
          }, (error) => {
            console.error("Error cropping image", error);
            reject(error);
          });*/

      }, function(error) {
        console.log(error);
        reject(error);
      });

  });  
    
}//FIn takin picture


}
