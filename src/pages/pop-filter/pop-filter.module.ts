import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopFilterPage } from './pop-filter';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PopFilterPage],
  imports: [IonicPageModule.forChild(PopFilterPage), TranslateModule.forChild()],
})

export class PopFilterPageModule {}
