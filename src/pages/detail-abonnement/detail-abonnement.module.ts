import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailAbonnementPage } from './detail-abonnement';
import { TranslateModule } from '@ngx-translate/core';
import { NgCircleProgressModule } from 'ng-circle-progress';


@NgModule({
  declarations: [
    DetailAbonnementPage,
  ],
  imports: [
		IonicPageModule.forChild(DetailAbonnementPage),
		TranslateModule.forChild(),
    NgCircleProgressModule.forRoot({
			radius: 60,
			maxPercent: 100,
			outerStrokeWidth: 10,
			innerStrokeWidth: 5,
			showSubtitle: false,
			showBackground: false,
			responsive: true
			// startFromZero: false
		})
  ],
})
export class DetailAbonnementPageModule {}
