import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsAchatsPage } from './details-achats';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DetailsAchatsPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsAchatsPage), TranslateModule.forChild()
  ],
})
export class DetailsAchatsPageModule {}
