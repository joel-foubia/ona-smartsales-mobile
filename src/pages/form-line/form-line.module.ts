import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormLinePage } from './form-line';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FormLinePage,
  ],
  imports: [
    IonicPageModule.forChild(FormLinePage), TranslateModule.forChild()
  ],
})
export class FormLinePageModule {}
