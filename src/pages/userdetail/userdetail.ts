import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UserdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userdetail',
  templateUrl: 'userdetail.html',
})
export class UserdetailPage {
  user: any;
  section;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.navParams.get('user');
    this.section = 'info';

    console.log('USer => ', this.user)
  }

  ionViewDidLoad() {
  }

}
