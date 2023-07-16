import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { LeadsPage } from './leads';

@NgModule({
  declarations: [
    LeadsPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadsPage),
    LazyLoadImageModule,
    TranslateModule.forChild()
  ],
})
export class LeadsPageModule {}
