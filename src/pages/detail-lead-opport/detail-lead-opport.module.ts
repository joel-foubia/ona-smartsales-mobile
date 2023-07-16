import { Ionic2RatingModule } from 'ionic2-rating';
// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailLeadOpportPage } from './detail-lead-opport';
// import { CacheImgModule } from '../../global';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    DetailLeadOpportPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailLeadOpportPage),
    // LazyLoadImageModule,
    // CacheImgModule.forRoot(),
    Ionic2RatingModule,
    ComponentsModule,
    TranslateModule.forChild(),
    NgCircleProgressModule.forRoot({
			radius: 50,
			maxPercent: 100,
			outerStrokeWidth: 8,
			innerStrokeWidth: 5,
			showSubtitle: false,
			showBackground: false,
			responsive: true
			// startFromZero: false
		})
  ],
})
export class DetailLeadOpportPageModule {}
