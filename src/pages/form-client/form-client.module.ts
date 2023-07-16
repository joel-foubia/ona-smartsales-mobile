import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
// import { Ionic2RatingModule } from 'ionic2-rating';
import { FormClientPage } from './form-client';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FormClientPage],
  imports: [
    IonicPageModule.forChild(FormClientPage),
    TranslateModule.forChild()
  ],
})
export class FormClientPageModule {}
