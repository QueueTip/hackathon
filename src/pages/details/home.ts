import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http} from "@angular/http";
import {Business} from "../../models/business.interface";
import {Inspection} from "../../models/inspection.interface";
import {Violation} from "../../models/violation.interface";
import {Company} from "../../models/company.interface";
import * as _ from "lodash";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    businesses: Business[];
    inspections: Inspection[];
    violations: Violation[];

    companies: Company[];

    constructor(public navCtrl: NavController, private http: Http) {

    }

    async ngOnInit() {
        this.businesses = (await this.http.get('assets/businesses.json').toPromise()).json();
        this.inspections = (await this.http.get('assets/inspections.json').toPromise()).json();
        this.violations = (await this.http.get('assets/violations.json').toPromise()).json();

        await this.populateInspectionsWithViolations();
        await this.populateBusinessesWithInspections();
        await this.buildCompanySummary();
    }

    private async populateInspectionsWithViolations() : Promise<void> {
        for (let inspection of this.inspections) {
            inspection.violations = this.violations.filter(v => v.business_id === inspection.business_id && v.date === inspection.date);
        }
    }

    private async populateBusinessesWithInspections() : Promise<void> {
        for (let business of this.businesses) {
            business.inspections = this.inspections.filter(i => i.business_id === business.business_id);
        }
    }

    private async buildCompanySummary() : Promise<void> {
        this.companies = _.chain(this.businesses)
            .groupBy((business) => business.name)
            .map((businessArray, name) => {
                let inspectionArrays: Array<Inspection[]> = _.map(businessArray, b => b.inspections);
                let businessInspections: Inspection[] = _.flatten(inspectionArrays);
                return {
                    name: name,
                    businesses: businessArray,
                    minScore: businessInspections.length > 0 ? _.minBy(businessInspections, i => i.score).score : 0,
                    maxScore: businessInspections.length > 0 ? _.maxBy(businessInspections, i => i.score).score : 0,
                    avgScore: businessInspections.length > 0 ? _.meanBy(businessInspections, i => i.score).toFixed(1) : 0,
                    parCustomer: true
                } as Company;
            })
            .value();
        console.log(this.companies);
    }

    private getScoreClass(score: number): string {
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
