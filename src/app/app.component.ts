import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {ItemsService} from './services/items.service';
import {timeout} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public loadingController: LoadingController,
    private itemService: ItemsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.itemService.getIsLoading()
          .subscribe(loading => {
              if (loading){
                  this.presentLoading();
              } else  {
                this.dismissLoading();
              }
          });
    });
  }

  dismissLoading(){
    setTimeout(() => {
      this.loadingController.getTop().then(top => {
        if (top){
          this.loadingController.dismiss();
          this.dismissLoading();
        }
      });
    }, 500);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...',
    });
    await loading.present();
    // const { role, data } = await loading.onDidDismiss();
  }
}
