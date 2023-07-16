import { NgModule } from '@angular/core';
import { PopUserPage } from './pop-user';
import { IonicPageModule } from 'ionic-angular';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [PopUserPage],
  imports: [CacheImgModule, IonicPageModule.forChild(PopUserPage)],
})
export class PopUserPageModule {}
