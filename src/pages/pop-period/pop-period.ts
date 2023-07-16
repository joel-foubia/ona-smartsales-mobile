import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the PopPeriodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pop-period',
  templateUrl: 'pop-period.html',
})
export class PopPeriodPage {
  public list : any = [];
  public period : any = {};

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
      this.list = this.navParams.get('listePeriod');
      console.log('Liste periods => ', this.list);                
  }
 
  changeValue($event){
    // console.log('result => ', $event)
    this.view.dismiss(this.period);
    // console.log('period => ', this.period);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopPeriodPage');
  }

}
