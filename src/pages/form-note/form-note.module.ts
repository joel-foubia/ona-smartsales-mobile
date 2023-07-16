import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormNotePage } from './form-note';
import { TranslateModule } from '@ngx-translate/core';
import { Autosize } from '../../directives/autosize/autosize';


@NgModule({
  declarations: [FormNotePage, Autosize],
  imports: [IonicPageModule.forChild(FormNotePage), TranslateModule.forChild()],
})
export class FormNotePageModule {}
