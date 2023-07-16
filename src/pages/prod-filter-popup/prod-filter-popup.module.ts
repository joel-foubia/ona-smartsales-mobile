import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdFilterPopupPage } from './prod-filter-popup';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProdFilterPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdFilterPopupPage),
    TranslateModule.forChild()
  ],
})
export class ProdFilterPopupPageModule {}
