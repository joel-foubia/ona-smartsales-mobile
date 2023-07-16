import { LazyLoadImageModule } from 'ng-lazyload-image';
// import { LoginLayout1 } from './../../components/login/layout-1/login-layout-1';
import { NgModule } from '@angular/core';
import { LoginPage } from './login';
import { IonicPageModule } from 'ionic-angular';
// import { LoginLayout1Module } from '../../components/login/layout-1/login-layout-1.module';
// import { ImageCacheDirective } from '../../directives/imagecache/imagecache';
import { ComponentsModule } from '../../components/components.module';
/*import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';*/

@NgModule({
  declarations: [
   LoginPage,
  //  LoginLayout1,
  //  ImageCacheDirective
  ],
  imports: [
   IonicPageModule.forChild(LoginPage), ComponentsModule,
   LazyLoadImageModule 
  ],
  // entryComponents:[
  //   LoginLayout1
  //  ]
})
export class LoginPageModule {}
