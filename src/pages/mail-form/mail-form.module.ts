import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MailFormPage } from './mail-form';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MailFormPage,
  ],
  imports: [
    IonicPageModule.forChild(MailFormPage),
    TranslateModule.forChild()
  ],
})
export class MailFormPageModule {}
