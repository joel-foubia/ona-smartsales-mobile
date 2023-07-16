import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallsPage } from './calls';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    CallsPage,
  ],
  imports: [
    IonicPageModule.forChild(CallsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class CallsPageModule {}
