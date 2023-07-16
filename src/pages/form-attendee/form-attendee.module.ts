import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormAttendeePage } from './form-attendee';

@NgModule({
  declarations: [
    FormAttendeePage,
  ],
  imports: [
    IonicPageModule.forChild(FormAttendeePage),
  ],
})
export class FormAttendeePageModule {}
