import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MailsPage } from './mails';

@NgModule({
  declarations: [
    MailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MailsPage),
  ],
})
export class MailsPageModule {}
