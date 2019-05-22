import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Filter } from '../../../core/models';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-dynamic-filters',
    templateUrl: './dynamic-filters.component.html',
    styleUrls: ['./dynamic-filters.component.scss'],
    animations: [
        trigger('advancedSearchToggler', [
            state('inactive', style({
                height: '0'
            })),
            state('active', style({
                height: '*'
            })),
            transition('* <=> *', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
        trigger('searchButtonToggler', [
            state('inactive', style({
                transform: 'rotate(0deg)'
            })),
            state('active', style({
                transform: 'rotate(180deg)'
            })),
            transition('* <=> *', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class DynamicFiltersComponent implements OnInit {
    mainFilters: Filter[] = [];
    secondaryFilters: Filter[] = [];
    advanceSearchState = 'inactive';
    searchIcon = 'add';
    filterForm: FormGroup;
    private filtersObject = {};

    constructor(
        private fb: FormBuilder
    ) { }

    @Input('filters') filters: any;

    @Output() parentActions = new EventEmitter<any>();

    ngOnInit() {
        this.filterForm = this.fb.group({})
        this.processFilters();
    }

    applyFilter() {
        const data = {
            action: 'filter',
            value: this.processFilterValues()
        }
        this.parentActions.next(data);
    }

    private processFilters() {
        for (let i = 0; i < this.filters.length; i++) {
            this.filterForm.addControl(this.filters[i].name, new FormControl(''));
            this.filtersObject[this.filters[i].name] = this.filters[i];
            this.filtersObject[this.filters[i].name]['value'] = null;

            if(!this.filters[i].advanceSearch) {
                this.mainFilters.push(this.filters[i]);
            } else {
                this.secondaryFilters.push(this.filters[i])
            }
        }

        this.filterForm.valueChanges.subscribe(
            values => {
                for (const key in values) {
                    if(this.filtersObject[key]['type'] == 'date') {
                        this.filtersObject[key]['value'] = new Date(values[key]);
                    } else {
                        this.filtersObject[key]['value'] = values[key];
                    }
                }
            }
        )
    }

    private processFilterValues() {
        let result = {};
        for (const key in this.filtersObject) {
            const value = this.filtersObject[key]['value'];
            const validDate = (value instanceof Date) ? (!isNaN(value.getTime())) ? true : false : true;
            if(value && value != '' && value['length'] != 0 && validDate) {
                let finalKey = key;
                if(key.includes('_')) {
                    finalKey = key.substring(0, key.indexOf('_'));
                }

                if(this.filtersObject[key]['condition'] == 'equal') {
                    result[finalKey] = value;
                } else {
                    if(this.filtersObject[key]['condition'] == 'in') {
                        result[finalKey]['$in'] = value;
                    }

                    if(this.filtersObject[key]['condition'] == 'contains') {
                        // result[key] = { $regex : '.*' + value + '.*' };
                        result['$text'] = { $search: value};
                    }

                    if(this.filtersObject[key]['condition'] == 'gte') {
                        if(typeof result[finalKey] === 'undefined') {
                            result[finalKey] = {};
                        }
                        result[finalKey]['$gte'] = value;
                    }

                    if(this.filtersObject[key]['condition'] == 'lte') {
                        if(typeof result[finalKey] === 'undefined') {
                            result[finalKey] = {};
                        }
                        result[finalKey]['$lte'] = value;
                    }
                }
            }
        }
        return result;
    }
    
    onToggleSearch() {
        if(this.advanceSearchState == 'inactive') {
            this.advanceSearchState = 'active';
            this.searchIcon = 'clear';
        } else{ 
            this.advanceSearchState = 'inactive';
            this.searchIcon = 'add';
        }
    }
}
