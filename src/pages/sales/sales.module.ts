import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalesPage } from './sales';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SalesPage,
  ],
  imports: [
    IonicPageModule.forChild(SalesPage),
    ComponentsModule,
    TranslateModule.forChild()
  ],
})
export class SalesPageModule {}
