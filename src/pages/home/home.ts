import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http} from "@angular/http";
import {Location} from "../../models/location.interface";
import {Inspection} from "../../models/inspection.interface";
import {Violation} from "../../models/violation.interface";
import {Company} from "../../models/company.interface";
import * as _ from "lodash";
import {DetailsPage} from '../details/details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    locations: Location[];
    inspections: Inspection[];
    violations: Violation[];

    companies: Company[];

    constructor(public navCtrl: NavController, private http: Http) {

    }

    async ngOnInit() {
        this.locations = (await this.http.get('assets/businesses.json').toPromise()).json();
        this.inspections = (await this.http.get('assets/inspections.json').toPromise()).json();
        this.violations = (await this.http.get('assets/violations.json').toPromise()).json();

        await this.populateInspectionsWithViolations();
        await this.populateLocationsWithInspections();
        await this.buildCompanySummary();
    }

    private async populateInspectionsWithViolations() : Promise<void> {
        for (let inspection of this.inspections) {
            inspection.violations = this.violations.filter(v => v.business_id === inspection.business_id && v.date === inspection.date);
        }
    }

    private async populateLocationsWithInspections() : Promise<void> {
        for (let location of this.locations) {
            location.inspections = this.inspections.filter(i => i.business_id === location.business_id);
        }
    }

    private async buildCompanySummary() : Promise<void> {
        this.companies = _.chain(this.locations)
            .groupBy(loc => loc.name)
            .map((locArray, name) => {
                let inspectionArrays: Array<Inspection[]> = _.map(locArray, b => b.inspections);
                let locInspections: Inspection[] = _.flatten(inspectionArrays);
                return {
                    name: name,
                    locations: locArray,
                    minScore: locInspections.length > 0 ? _.minBy(locInspections, i => i.score).score : 0,
                    maxScore: locInspections.length > 0 ? _.maxBy(locInspections, i => i.score).score : 0,
                    avgScore: locInspections.length > 0 ? Math.floor(_.meanBy(locInspections, i => i.score) * 10) / 10 : 0,
                    parCustomer: true
                } as Company;
            })
            .value();
        console.log(this.companies);
    }

    goToCompanyDetails(company: Company) {
        this.navCtrl.push(DetailsPage, {company: company});
    }

    getScoreClass(score: number): string {
        /*0,70,"Poor"
        71,85,"Needs Improvement"
        86,90,"Adequate"
        91,100,"Good"*/

        if (score > 90) return "scoreGood";
        if (score > 85) return "scoreOK";
        if (score > 70) return "scoreMeh";
        return "scoreBad";
    }
}
