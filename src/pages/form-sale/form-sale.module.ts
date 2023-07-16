import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormSalePage } from './form-sale';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FormSalePage,
  ],
  imports: [
    IonicPageModule.forChild(FormSalePage), TranslateModule.forChild()
  ],
})
export class FormSalePageModule {}
