import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Company} from "../../models/company.interface";

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {

    company: Company;

    constructor(public navCtrl: NavController, private navParams: NavParams) {
        this.company = this.navParams.get("company");

        for (let location of this.company.locations) {
            location.inspections.sort((a, b) => {
                if (a.date < b.date) return 1;
                if (a.date > b.date) return -1;
                return 0;
            });
        }
    }

    async ngOnInit() {
    }

    getScoreClass(score: number): string {
        /*0,70,"Poor"
        71,85,"Needs Improvement"
        86,90,"Adequate"
        91,100,"Good"*/

        if (score > 90) return "scoreGood";
        if (score > 85) return "scoreOK";
        if (score > 70) return "scoreMeh";
        if (score === -1) return "scoreNA";
        return "scoreBad";
    }
}
