import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage } from 'ionic-angular';

import { AfProvider } from '../../providers/af/af';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  faqs: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afServ: AfProvider, private translate: TranslateService, public alertCtrl: AlertController) {
    this.afServ.getFAQ().subscribe(res=>{
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        if(res[i].title==this.translate.getDefaultLang()){
          this.faqs = res[i].tab;
          break;
        }
      }
    });
  }

  ionViewDidLoad() { 
  }

  //Cette fonction permet d'afficher la boite de dialogue
  showAnswer(obj){

    let alert = this.alertCtrl.create({
      title: obj.q,
      message: obj.r,
      buttons: ['OK'],
      cssClass:'dialog_answer'
    });
    
    alert.present();
  }

}
