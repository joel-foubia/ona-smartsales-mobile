import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopLanguePage } from './pop-langue';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PopLanguePage,
  ],
  imports: [
    IonicPageModule.forChild(PopLanguePage), TranslateModule.forChild()
  ],
})
export class PopLanguePageModule {}
