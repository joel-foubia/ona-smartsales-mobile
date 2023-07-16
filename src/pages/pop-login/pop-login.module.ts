import { NgModule } from '@angular/core';
import { PopLoginPage } from './pop-login';
import { IonicPageModule } from 'ionic-angular';
import { CacheImgModule } from '../../global';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PopLoginPage],
  imports: [CacheImgModule, IonicPageModule.forChild(PopLoginPage), TranslateModule.forChild()],
})
export class PopLoginPageModule {}
