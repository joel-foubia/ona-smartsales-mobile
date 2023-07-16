import { Component } from '@angular/core';
import { ViewController, NavParams, IonicPage } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  type: any;
  report: string;
  aide: any = {};

  constructor(public vc: ViewController, public navParams: NavParams) {
    this.type = this.navParams.get('type');
  }

  ionViewDidLoad() {
    
  }

  //Envoyer un report
  sendReport(){

    if(this.type.label=='report')
      this.vc.dismiss(this.report);
    else if(this.type.label=='assistance')
      this.vc.dismiss(this.aide);
  }

  close(){
    this.vc.dismiss();
  }

}
