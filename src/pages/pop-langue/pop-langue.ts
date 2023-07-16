import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { ConfigOnglet } from '../../config';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-pop-langue',
  templateUrl: 'pop-langue.html',
})
export class PopLanguePage {
  langs = [];

  constructor(public vc: ViewController, private translate: TranslateService) {

    // this.translate.get('pop').subscribe(res=>{

    //   this.langs = ConfigOnglet.langues(res);
    // });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopLanguePage');
  }

  changeLangue(lang){
    this.vc.dismiss(lang);
  }

}
