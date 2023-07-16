import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OptionspopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-optionspop',
  templateUrl: 'optionspop.html',
})
export class OptionspopPage {

  lead;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.lead = navParams.get('leadParam');
    console.log('Passed Lead', this.lead);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad OptionspopPage');
  }

}
