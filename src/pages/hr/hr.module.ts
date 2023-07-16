import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrPage } from './hr';
// import LazyLoadImageModule from 'ng-lazyload-image';
import { TranslateModule } from '@ngx-translate/core';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [
    HrPage,
  ],
  imports: [
    CacheImgModule,
    IonicPageModule.forChild(HrPage),
    // LazyLoadImageModule,
    TranslateModule.forChild(),
  ],
})
export class HrPageModule {}
