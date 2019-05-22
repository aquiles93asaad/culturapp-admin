import {
    Component,
    OnInit,
    ViewChild,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatSort } from '@angular/material';
import { TableColumn, TableAction } from '../../../core/models';
import * as $ from 'jquery';

@Component({
    selector: 'app-dynamic-table',
    templateUrl: './dynamic-table.component.html',
    styleUrls: ['./dynamic-table.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class DynamicTableComponent implements OnInit {
    themeColor: string = (localStorage.getItem('user_color')) ? localStorage.getItem('user_color') : 'primary';
    displayedColumns: string[];
    expandedElement: any;
    user = (<any>window).user;

    @Input('dataSource') dataSource: any;
    @Input('columnsArray') columnsArray: TableColumn[];
    @Input('actions') actions: TableAction[];
    @Input('multiCheck') multiCheck: boolean;
    @Input('tableSelection') selection: any;
    @Input('hasDetail') hasDetail: boolean;
    @Input('detailType') detailType: string;
    @Input('detailListItems') detailListItems: string;
    @Input('detailListColumns') detailListColumns: TableColumn[];
    @Input('detailListActions') detailListActions: TableAction[];
    @Input('showLoader') showLoader: boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Output() parentActions = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayedColumns = this.parseColumnsArray();
    }

    parseColumnsArray(): string[] {
        let result = [];
        if(this.multiCheck) {
            result.push('select');
        }
        for (let i = 0; i < this.columnsArray.length; i++) {
            result.push(this.columnsArray[i].name);
        }
        return result;
    }
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    executeAction(action, element, parentElement?) {
        const actionData = {
            action: action,
            element: element,
            parentElement: parentElement
        }
        this.parentActions.next(actionData);
    }

    showColumn(roles) {
        let result = false;

        if (roles.includes('ALL')) {
            result = true;
        } else {
            if (this.hasCommonElement(roles, this.user.roles)) {
                result = true;
            }
        }

        return result;
    }

    showButton(conditions, element, subElement) {
        let result = true;
        let value = null;
        if(typeof conditions !== 'undefined') {
            for (let i = 0; i < conditions.length; i++) {
                if(conditions[i].element == 'element') {
                    value = element[conditions[i].key];
                } else {
                    value = subElement[conditions[i].key];
                }

                if(typeof conditions[i].min !== 'undefined') {
                    if(value < conditions[i].min) {
                        result = false;
                        break;
                    }
                }

                if(typeof conditions[i].max !== 'undefined') {
                    if(value > conditions[i].max) {
                        result = false;
                        break;
                    }
                }

                if(typeof conditions[i].hasValue !== 'undefined') {
                    if( (conditions[i].hasValue && (typeof value === 'undefined' || value == null)) || (!conditions[i].hasValue && (typeof value !== 'undefined' || value != null)) ) {
                        result = false;
                        break;
                    }
                }

                if(typeof conditions[i].values !== 'undefined') {
                    if(!conditions[i].values.includes(value)) {
                        result = false;
                        break;
                    }
                }
            }
        }
        return result;
    }

    tableButtons(event) {
        event.stopPropagation();
    }

    private hasCommonElement(arr1, arr2) {
        var bExists = false;
        $.each(arr2, function (index, value) {

            if ($.inArray(value, arr1) != -1) {
                bExists = true;
            }

            if (bExists) {
                return false;
            }
        });
        return bExists;
    }
}