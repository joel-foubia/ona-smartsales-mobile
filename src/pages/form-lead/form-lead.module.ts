import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { FormLeadPage } from './form-lead';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    FormLeadPage,
  ],
  imports: [
    IonicPageModule.forChild(FormLeadPage),
    Ionic2RatingModule,
    TranslateModule.forChild()
  ],
})
export class FormLeadPageModule {}
