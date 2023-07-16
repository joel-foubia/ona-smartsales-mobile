import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { AfProvider } from '../../providers/af/af';


@IonicPage()
@Component({
  selector: 'page-form-aide',
  templateUrl: 'form-aide.html',
})
export class FormAidePage {
  type: any;
  report: string;
  aide: any = {};

  constructor(public vc: ViewController, public navParams: NavParams, private afServ: AfProvider) {
    // this.type = this.navParams.get('type');
  }

  ionViewDidLoad() {
    
  }

  //Envoyer un report
  sendReport(){

    this.afServ.getInfosAbout((res)=>{
      this.aide['email_info'] = res.email;
      this.vc.dismiss(this.aide);
    });

  }

  close(){
    this.vc.dismiss();
  }

}