import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormMailPage } from './form-mail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FormMailPage,
  ],
  imports: [
    IonicPageModule.forChild(FormMailPage),
    TranslateModule.forChild()
  ],
})
export class FormMailPageModule {}
