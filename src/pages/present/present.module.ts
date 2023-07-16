import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PresentPage } from './present';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PresentPage,
  ],
  imports: [
    IonicPageModule.forChild(PresentPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class PresentPageModule {}
