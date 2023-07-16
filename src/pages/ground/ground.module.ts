import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroundPage } from './ground';
import { AgmCoreModule } from '@agm/core';
// import { ComponentsModule } from '../../components/components.module';
import { CacheImgModule } from '../../global';

@NgModule({
  declarations: [
    GroundPage,
  ],
  imports: [
    IonicPageModule.forChild(GroundPage),
    AgmCoreModule,
    CacheImgModule
  ],
})
export class GroundPageModule {}
