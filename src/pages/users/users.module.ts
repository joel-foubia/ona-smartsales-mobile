import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersPage } from './users';
import { CacheImgModule } from '../../global';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    UsersPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(UsersPage),
    TranslateModule.forChild()
  ],
})
export class UsersPageModule {}
