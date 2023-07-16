import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsEventPage } from './details-event';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    DetailsEventPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsEventPage),
    TranslateModule.forChild()
  ],
})
export class DetailsEventPageModule {}
