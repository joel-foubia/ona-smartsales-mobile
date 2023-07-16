// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import { ActionSheetController, Events } from 'ionic-angular';
// import { NgProgressService } from 'ng2-progressbar';
import * as Tesseract from 'tesseract.js';
import swal from 'sweetalert';
// import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class OcrEngineProvider {
  imageText: string;

  constructor(
    private camera: Camera,
    private action: ActionSheetController,
    public evts: Events
    /* private pService: NgProgressService */) {
    // this.errorMessage();

  }
  // /**
  //  * @author Joel Bonbon
  //  * @description cette methode gère la traduction du text provenant du service.
  //  */
  // private errorMessage() {
  // 	this.translate.get('message').subscribe((res) => {
  // 		this.objMessage = res;
  // 	});
  // }
  /**
   * @author Joel Bonbon
   * @param getImage 
   * @description Pour faire les tests directement aparti de la machine. Elle prend
   * en parametre l'image qui est stocker dans le répertoire assets/imgs.
   */
  executeImage(getImage) {
    return new Promise((resolve, reject) => {
      this.recognizeImage(getImage).then((image) => {
        if (image) {
          resolve(image);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }
  /**
   * @author Joel Bonbon
   * @param treatImage 
   * @description Execute l'extraction des texts sur une capture ou une image.
   */
  recognizeImage(treatImage) {
    return new Promise((resolve, reject) => {
      Tesseract.recognize(treatImage).progress((message) => {
        if (message.status == 'recognizing text') {
          console.log(message);
          this.evts.publish('recognised:done', message.progress)
          // this.pService.set(message.progress);
        }
      }).then((result) => {
        this.imageText = result.text;
        resolve(this.imageText);
        console.log('result => ', result);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  /**
   * 
   * @param uploadImage 
   * @param objMessage 
   * @author Joel Bonbon
   * @description effective seulement dans un dispositif (téléphone). Elle permet de choisir l'image
   * ou de la capturer et execute l'extraction des textes juste après l'affichage de l'image   
   */
  selectSource(uploadImage) {
    return new Promise((resolve, reject) => {
      let actionSheet = this.action.create({
        buttons: [
          {
            text: "Galerie",
            handler: () => {
              this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY, uploadImage).then((galerie) => {
                if (galerie) {
                  resolve(galerie);
                  this.recognizeImage(galerie).then((image) => {
                    if (image) {
                      resolve(image);
                    }
                  }).catch((err) => {
                    reject(err);
                  });
                } else {
                  swal(
                     "Erreur de traitement",
                    "Veuillez réessayer",
                    "warning, error ou success"
                  ).then((err) => {
                    console.error(err);
                  });
                }
              });
            }

          }, {
            text: "Capture Image",
            handler: () => {
              this.getPicture(this.camera.PictureSourceType.CAMERA, uploadImage).then((capture) => {
                if (capture) {
                  resolve(capture);
                  this.recognizeImage(capture).then((image) => {
                    if (image) {
                      resolve(image);
                    }
                  }).catch((err) => {
                    reject(err);
                  });
                } else {
                  swal(
                    "Erreur de traitement",
                    "Veuillez réessayer",
                    "warning"
                  ).then((err) => {
                    console.error(err);
                  });
                }
              });
            }
          }, {
            text: "Annuler",
            role: "cancel"
          }

        ]
      });
      actionSheet.present();
    });
  }
  /**
   * @author Joel Bonbon
   * @param sourceType 
   * @param gottenImage 
   * @description Elle permet de récupéré une image via la camera du téléphone.
   */
  getPicture(sourceType: PictureSourceType, gottenImage) {
    return new Promise((resolve, reject) => {
      this.camera.getPicture({
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        allowEdit: true,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }).then((imageData) => {
        gottenImage = 'data:image/jpeg;base64,' + imageData;
        resolve(gottenImage);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
