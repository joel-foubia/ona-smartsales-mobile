import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CataloguePage } from './catalogue';
import { TranslateModule } from '@ngx-translate/core';
import { CacheImgModule } from '../../global';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CataloguePage,
  ],
  imports: [
    IonicPageModule.forChild(CataloguePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class CataloguePageModule {}
