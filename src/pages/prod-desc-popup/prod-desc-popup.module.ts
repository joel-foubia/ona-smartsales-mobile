import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdDescPopupPage } from './prod-desc-popup';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    ProdDescPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdDescPopupPage),
    TranslateModule.forChild()
  ],
})
export class ProdDescPopupPageModule {}
