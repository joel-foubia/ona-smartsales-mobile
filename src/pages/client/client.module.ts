import { IonicPageModule } from 'ionic-angular';
import { ClientPage } from './client';
import { NgModule } from '@angular/core'
// import LazyLoadImageModule from 'ng-lazyload-image';
import { TranslateModule } from '@ngx-translate/core';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [
    ClientPage
  ],
  imports: [
    CacheImgModule,
    IonicPageModule.forChild(ClientPage),
    // LazyLoadImageModule, 
    TranslateModule.forChild()
  ],
})
export class ClientPageModule {}
