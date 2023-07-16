import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormProductPage } from './form-product';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    FormProductPage,
  ],
  imports: [
    IonicPageModule.forChild(FormProductPage),
    TranslateModule.forChild()
  ],
})
export class FormProductPageModule {}
