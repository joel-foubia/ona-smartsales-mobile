import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { NgCalendarModule } from 'ionic2-calendar';
import { MyApp } from './app.component';
import { SmsPage } from '../pages/sms/sms';
import {ProgressBarModule} from "angular-progress-bar"

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { LoginLayout1 } from '../components/login/layout-1/login-layout-1';
import { ParallaxLayout1 } from '../components/parallax/layout-1/parallax-layout-1';
import { ElasticHeader } from '../components/parallax/elastic-header';

// import { AgmCoreModule } from 'angular2-google-maps/core';
import { ColorPickerComponent } from '../components/color-picker/color-picker';
// import { MapsLayout2 } from '../components/maps/layout-2/maps-layout-2';

import { OdooProvider } from '../providers/odoo/odoo';
import { GeneralProvider } from '../providers/general/general';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DataProvider } from '../providers/data/data';
import { SQLite } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';
import { SMS } from '@ionic-native/sms';
//import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
//import { QRScanner } from '@ionic-native/qr-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { LoginProvider } from '../providers/login/login';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
//import { AngularFireAuthModule } from 'angularfire2/auth';
import { AfProvider } from '../providers/af/af';
import { ImageProvider } from '../providers/image/image';
import { AffaireProvider } from '../providers/affaire/affaire';
import { AppRate } from '@ionic-native/app-rate';
import { File } from '@ionic-native/file';
import { AgmCoreModule } from '@agm/core';

import { QrCodeProvider } from '../providers/qr-code/qr-code';
import { Calendar } from '@ionic-native/calendar';
import { DragulaModule } from 'ng2-dragula';
import {
	TranslateModule,
	TranslateLoader,
	TranslateParser,
	MissingTranslationHandler,
	TranslateCompiler
} from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { HttpModule, Http } from '@angular/http';
import { CacheImgModule } from '../global';
import { CallLog } from '@ionic-native/call-log';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';


import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { OcrEngineProvider } from '../providers/ocr-engine/ocr-engine';

// // the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');

/** Configuration Firebase **/
export function setTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const firebaseConfig = {
	apiKey: 'AIzaSyCAnUSC65A59TIEqikdZiEg2oONjvqltCk',
	authDomain: 'ona-smart-sales.firebaseapp.com',
	databaseURL: 'https://ona-smart-sales.firebaseio.com',
	projectId: 'ona-smart-sales',
	storageBucket: 'ona-smart-sales.appspot.com',
	messagingSenderId: '1020653521409'
};

@NgModule({
	declarations: [
		MyApp,
		// InfosPage,
		SmsPage,
		ElasticHeader,
		// ImageCacheDirective,
		// CalendarEvPage,
		ParallaxLayout1,
		ColorPickerComponent
	],
	imports: [
		BrowserModule,
		// LazyLoadImageModule,
		ProgressBarModule,
		HttpClientModule,
		IonicModule.forRoot(MyApp),
		NgCalendarModule,
		CacheImgModule.forRoot(),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDs8n2tabI8t14aR0YlxWQY6D5BBp1Huh0'
		}),
		// ImgCacheModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: setTranslateLoader,
				deps: [ HttpClient ]
			}
		}),
		DragulaModule,
		// AgmCoreModule.forRoot({ apiKey: 'AIzaSyDs8n2tabI8t14aR0YlxWQY6D5BBp1Huh0' }),
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireDatabaseModule,
		AngularFireOfflineModule,
		IonicStorageModule.forRoot({
			name: '_ona_smartsales'
		})
	],
	bootstrap: [ IonicApp ],
	entryComponents: [
		MyApp,
		SmsPage,
		ParallaxLayout1,
		// CalendarEvPage,
		ColorPickerComponent
		// InfosPage,
		// InvoicesPage,
	],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		OdooProvider,
		AffaireProvider,
		GeneralProvider,
		CallNumber,
		EmailComposer,
		InAppBrowser,
		SMS,
		SQLite,
		SpeechRecognition,
		DataProvider,
		LoginProvider,
		AfProvider,
		ImageProvider,
		LaunchNavigator,
		Calendar,
		HttpClient,
		Geolocation,
		BarcodeScanner,
		QrCodeProvider,
		Network,
		SocialSharing,
		Crop,
		File,
		Camera,
		CallLog,
		AppRate,
		FingerprintAIO,
    OcrEngineProvider
		// CalendrierProvider
	]
})
export class AppModule {}
