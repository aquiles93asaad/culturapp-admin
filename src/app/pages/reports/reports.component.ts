import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OpportunityService } from '../../core/services'
import { ActivatedRoute } from '@angular/router';
import { Breadcrumb } from '../../core/models'

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
    echartsPie: EChartOption;
    echartsBar: EChartOption;
    filtersForm:FormGroup;
    isSubmitting: boolean = false;
    maxDate: Date = new Date();
    private pieVariables: any;
    private barVariables: any;

    breadcrumbs: Breadcrumb[] = [
        { text: 'Inicio', href: '/dashboard/inicio' },
        { text: 'Reportes', href: '/dashboard/reportes ' }
    ];

    constructor(
        private opportunityService: OpportunityService,
        private _route: ActivatedRoute,
        private formBuilder: FormBuilder,
    ) {

    }

    ngOnInit() {
        this.filtersForm = this.formBuilder.group({
            fromDate: [''],
            toDate: ['']
        });

        this._route.data.subscribe(
            data => {
                this.refresh(data.opportunitiesList.opportunities);   
            }
        )
    }

    get f() { return this.filtersForm.controls; }

    submitForm() {
        if(this.filtersForm.valid) {
            this.isSubmitting = true;
            const filtersValues = this.filtersForm.value;
            const filters = { createdAt: {} }
            if(filtersValues.fromDate) {
                filters.createdAt['$gte'] = new Date(filtersValues.fromDate);
            }
            if(filtersValues.toDate) {
                filters.createdAt['$lte'] = new Date(filtersValues.toDate);
            }

            this.opportunityService.get(filters)
            .subscribe(
                opportunities => {
                    this.refresh(opportunities);
                },
                error => {
                    console.log(error)
                    // this.showMessage(error.statusText);
                },
                () => {
                    this.isSubmitting = false;
                }
            );
        }
    }
    private refresh(opportunities) {
        this.initializeEchartsVariables();
        this.processOpportunitiesForCharts(opportunities);
        this.updateEchartsPieOptions();
        this.updateEchartsBarPieOptions();
    }

    private initializeEchartsVariables() {
        this.pieVariables = {
            won: {
                value: null,
                name: 'Ganadas'
            },
            lost: {
                value: null,
                name: 'Perdidas'
            },
            dismissed: {
                value: null,
                name: 'Desechadas'
            },
            active: {
                value: null,
                name: 'Activas'
            }
        };
    
        this.barVariables = {
            won: {
                value: null,
                name: 'Ganadas'
            },
            lost: {
                value: null,
                name: 'Perdidas'
            },
            dismissed: {
                value: null,
                name: 'Desechadas'
            },
            active: {
                value: null,
                name: 'Activas'
            }
        };
    }

    private processOpportunitiesForCharts(opportunities) {
        for (let i = 0; i < opportunities.length; i++) {
            // Para pie echart
            for (const key in this.pieVariables) {
                if(key == opportunities[i].state) {
                    this.pieVariables[key].value++;
                    break;
                }
            }

            // Para bar echart
            for (const key in this.barVariables) {
                if(key == opportunities[i].state) {
                    if(typeof opportunities[i].estimatedTotal != 'undefined')
                        this.barVariables[key].value = this.barVariables[key].value + opportunities[i].estimatedTotal;
                        break;
                }
            }
        }
    }

    private updateEchartsPieOptions() {
        this.echartsPie = {
            title: {
                text: 'Cantidad de oportunidades',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#000000'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [{
                name: 'Oportunidades',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: this.parsePieVariables()
                // [
                //     { value: this.won, name: 'Ganadas' },
                //     { value: this.lost, name: 'Perdidas' },
                //     { value: this.dismissed, name: 'Desechadas'},
                //     { value: this.active, name: 'En progreso' }
                // ]
            }]
        }
    }

    private updateEchartsBarPieOptions() {
        this.echartsBar = {
            title: {
                text: 'Precio total oportunidades',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#000000'
                }
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.barYVariable(),
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'Valor total',
                type: 'bar',
                barWidth: '60%',
                data: this.barXVariable()
            }]
        }
    }

    private parsePieVariables() {
        let result = [];
        for (const key in this.pieVariables) {
            result.push({
                value: this.pieVariables[key].value,
                name: this.pieVariables[key].name
            })
        }
        return result;
    }

    private barXVariable() {
        let result = [];
        for (const key in this.barVariables) {
            result.push({
                value: this.barVariables[key].value,
            })
        }
        return result;
    }

    private barYVariable() {
        let result = [];
        for (const key in this.barVariables) {
            result.push({
                value: this.barVariables[key].name,
            })
        }
        return result;
    }
}