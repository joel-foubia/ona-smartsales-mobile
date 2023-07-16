import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserdetailPage } from './userdetail';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [
    UserdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserdetailPage),
    CacheImgModule
  ],
})
export class UserdetailPageModule {}
