import { Component, OnInit, Input } from '@angular/core';
import { Breadcrumb } from '../../../core/models';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

    @Input('breadcrumbs') breadcrumbs: Breadcrumb[];

    constructor() { }

    ngOnInit() {
    }
}
