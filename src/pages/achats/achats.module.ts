import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AchatsPage } from './achats';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [ AchatsPage ],
	imports: [ IonicPageModule.forChild(AchatsPage), ComponentsModule, TranslateModule.forChild() ]
})
export class AchatsPageModule {}
