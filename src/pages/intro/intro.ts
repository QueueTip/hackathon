import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from "../home/home";
import * as _ from "lodash";

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage {

    leaving: boolean = false;
    constructor(public navCtrl: NavController) {

    }

    async start() {
        let delay = function(ms: number) {
            return new Promise( resolve => setTimeout(resolve, ms) );
        };
        this.leaving = true;


        await delay(2000);

        await this.navCtrl.setRoot(HomePage);
    }
}
