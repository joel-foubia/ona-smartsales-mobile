import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsSalePage } from './details-sale';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DetailsSalePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsSalePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class DetailsSalePageModule {}
