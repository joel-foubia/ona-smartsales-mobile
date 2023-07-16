import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopOverPage } from './pop-over';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [PopOverPage],
  imports: [IonicPageModule.forChild(PopOverPage), TranslateModule.forChild()],
})
export class PopOverPageModule {}
