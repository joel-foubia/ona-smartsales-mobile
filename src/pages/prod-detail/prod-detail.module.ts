import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdDetailPage } from './prod-detail';
import { CacheImgModule } from '../../global';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ProdDetailPage,
  ],
  imports: [
    CacheImgModule,
    IonicPageModule.forChild(ProdDetailPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class ProdDetailPageModule {}
