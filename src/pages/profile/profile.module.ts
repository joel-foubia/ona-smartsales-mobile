// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { TranslateModule } from '@ngx-translate/core';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    CacheImgModule,
    IonicPageModule.forChild(ProfilePage),
    // LazyLoadImageModule,
    TranslateModule.forChild()
  ],
})
export class ProfilePageModule {}