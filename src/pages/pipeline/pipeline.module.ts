// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipelinePage } from './pipeline';
// import { CacheImgModule } from '../../global';
import { TranslateModule } from '@ngx-translate/core';
// import { Ionic2RatingModule } from 'ionic2-rating';
// import { NgCircleProgressModule } from 'ng-circle-progress';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PipelinePage,
  ],
  imports: [
    IonicPageModule.forChild(PipelinePage),
    // CacheImgModule,
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class PipelinePageModule {}
