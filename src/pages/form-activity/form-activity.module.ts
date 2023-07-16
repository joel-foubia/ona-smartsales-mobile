import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormActivityPage } from './form-activity';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FormActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(FormActivityPage),
    ComponentsModule
  ],
})
export class FormActivityPageModule {}
