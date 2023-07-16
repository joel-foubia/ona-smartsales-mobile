import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController } from 'ionic-angular';
import { OcrEngineProvider } from '../../providers/ocr-engine/ocr-engine';

/**
 * Generated class for the TestOcrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-ocr',
  templateUrl: 'test-ocr.html',
})
export class TestOcrPage {
  // selectedImage: string = 'assets/imgs/carteGris.jpeg';
  selectedImage: string;
  imageText: string;
  rec_progress = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public evts: Events,
    public view : ViewController,
    public ocrEngine: OcrEngineProvider) {
    this.evts.subscribe('recognised:done', data => {
      this.rec_progress = data * 100
    })
  }

  ionViewDidLoad() {
  }
  closeRecharge(){
    this.navCtrl.setRoot('MainPage');
  }
  ocrGenerate() {
    // objet.swalHeadMessage = 'Erreur de traitement.';
    // objet.sawalBodyMessage = 'Veuillez réessayer.';
    // objet.sawalBodyMessage = 'displayWarning.';
    // objet.textCapture = 'Capture Image';
    // objet.textGallery = 'Text Galerie';
    // objet.annuler = 'Annuler';
    // objet.cancel = 'Cancel';

    this.ocrEngine.selectSource(this.selectedImage).then((text: any) => {
      if (text) {
        this.imageText = text;
        // console.log('Text => ', this.imageText);
      } else {
        // console.log('err');
      }
    });
  }
  recognizeImage(){
    this.ocrEngine.recognizeImage(this.selectedImage).then((img : any)=>{
      if(img){
        this.imageText = img;
      }
    });
  }

}
