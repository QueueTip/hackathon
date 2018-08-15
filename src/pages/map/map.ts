import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Company} from "../../models/company.interface";
import {Location} from "../../models/location.interface";

import * as _ from "lodash";

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

    company: Company;
    locations: Location[];

    @ViewChild('map') mapElement: ElementRef;
    map: any;

    constructor(public navCtrl: NavController, private navParams: NavParams) {
        this.company = this.navParams.get("company");
        this.locations = this.company.locations.sort((a, b) => {
            if (a.business_id < b.business_id) return -1;
            if (a.business_id > b.business_id) return 1;
            return 0;
        });

        for (let location of this.locations) {
            location.inspections.sort((a, b) => {
                if (a.date < b.date) return 1;
                if (a.date > b.date) return -1;
                return 0;
            });
        }
    }

    async ngOnInit() {
        let locWithCoords = this.locations.find(loc => !!loc.latitude && !!loc.longitude);
        let startingCoords = locWithCoords ? {lat: locWithCoords.latitude, lng: locWithCoords.longitude} : {lat: 41.850033, lng: -87.6500523};
        let latLng;
        //if (minLat && minLong && maxLat && maxLong) {
        //    latLng = new google.maps.LatLngBounds([{lat: minLat, lng: minLong}, {lat: maxLat, lng: maxLong}]);
        //} else {
            latLng = new google.maps.LatLng(startingCoords);
        //}


        let mapOptions = {
            center: latLng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        let delay = function(ms: number) {
            return new Promise( resolve => setTimeout(resolve, ms) );
        };

        for (let loc of this.locations) {
            if (loc.latitude && loc.longitude) {
                let score = loc.inspections.length > 0 ? Math.floor(_.meanBy(loc.inspections, i => i.score) * 10) / 10 : -1;
                await this.addMarker({lat: loc.latitude, lng: loc.longitude}, score);
                await delay(250);
            }
        }

    }


    addMarker(coords, score){

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: coords
        });
        let iconOptions = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            strokeColor: 'black',
            strokeOpacity: 0.6,
            strokeWeight: 1.0,
            fillColor: this.getScoreColor(score),
            fillOpacity: 1
        }
        marker.setIcon(iconOptions);

        let content = "<h4>Information!</h4>";

        this.addInfoWindow(marker, content);

    }

    addInfoWindow(marker, content){

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });

    }

    getScoreColor(score: number): string {
        /*0,70,"Poor"
        71,85,"Needs Improvement"
        86,90,"Adequate"
        91,100,"Good"*/
        if (score > 90) return "#00CC00";
        if (score > 85) return "#DDDD0";
        if (score > 70) return "#FFAA00";
        if (score === -1) return "#888888";
        return "#FF4444";
    }
}
