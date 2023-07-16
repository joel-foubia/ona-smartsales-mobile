// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicPageModule } from 'ionic-angular';
import { DetailClientPage } from './detail-client';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CacheImgModule } from '../../global';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DetailClientPage
  ],
  imports: [
    CacheImgModule,
    IonicPageModule.forChild(DetailClientPage),
    ComponentsModule,
    // LazyLoadImageModule,
    TranslateModule.forChild()
  ],
})
export class DetailClientPageModule {}
