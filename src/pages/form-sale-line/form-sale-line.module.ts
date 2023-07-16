import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormSaleLinePage } from './form-sale-line';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FormSaleLinePage,
  ],
  imports: [
    IonicPageModule.forChild(FormSaleLinePage), TranslateModule.forChild()
  ],
})
export class FormSaleLinePageModule {}
