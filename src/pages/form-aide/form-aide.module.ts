import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormAidePage } from './form-aide';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FormAidePage,
  ],
  imports: [
    IonicPageModule.forChild(FormAidePage), TranslateModule.forChild()
  ],
})
export class FormAidePageModule {}
