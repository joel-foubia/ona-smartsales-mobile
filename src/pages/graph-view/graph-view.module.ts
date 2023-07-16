import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraphViewPage } from './graph-view';
import { TranslateModule } from '@ngx-translate/core';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [
    GraphViewPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphViewPage),
    TranslateModule.forChild(),
    CacheImgModule
  ],
})
export class GraphViewPageModule {}
