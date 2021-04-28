import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // Bar
public barChartOptions: ChartOptions = {
  responsive: true,
  
  scales: { xAxes: [{}], yAxes: [{}] },
  plugins: {
    datalabels: {
      anchor: 'end',
      align: 'end',
    }
  }
};
public barChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
public barChartType: ChartType = 'bar';
public barChartLegend = true;
public barChartPlugins = [pluginDataLabels];
public barChartData: ChartDataSets[] = [
  { data: [65, 59, 80, 81, 56, 55, 40, 56, 87, 23, 44, 45], label: 'Meta', backgroundColor: 'rgba(134, 134, 247)', hoverBackgroundColor: 'rgba(78, 78, 173)'  },
  { data: [28, 48, 40, 19, 86, 27, 80, 62, 58, 56, 87, 33], label: 'Alcanzado', backgroundColor: 'rgba(160, 247, 132)', hoverBackgroundColor: 'rgba(96, 186, 58)'  },
];

public barChartLabels1: Label[] = ['Jorge Heras', 'David Hernandez', 'Osvaldo Hernandez', 'Carlos linares', 'Sergio Aramburu', 'Oscar Santillan'];
public barChartType1: ChartType = 'bar';
public barChartLegend1 = true;
public barChartPlugins1 = [pluginDataLabels];
public barChartData1: ChartDataSets[] = [
  { data: [65 , 59, 80, 81, 56,65], backgroundColor: 'rgba(228, 177, 252)', hoverBackgroundColor: 'rgba(161, 86, 204)', },
 
];

public barChartLabels2: Label[] =  ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
public barChartType2: ChartType = 'bar';
public barChartLegend2 = true;
public barChartPlugins2 = [pluginDataLabels];
public barChartData2: ChartDataSets[] = [
  { data: [25, 59, 80, 81, 56, 65, 32, 19, 82, 65, 33, 51], backgroundColor: 'rgba(255, 92, 92)', hoverBackgroundColor: 'rgba(158, 27, 27)', },
 
];



//Stepper
//firstFormGroup: FormGroup = new FormGroup({});
//secondFormGroup: FormGroup = new FormGroup({});
//isEditable = false;

//Pie
public pieChartOptions: ChartOptions = {
  responsive: true,
  legend: {
    position: 'top',
  },
};
public pieChartLabels: Label[] = [['Falta de Pago'], ['Desistimiento'], 'Morosidad', 'Otros'];
public pieChartData: number[] = [300, 700, 100, 350];
public pieChartType: ChartType = 'pie';
public pieChartLegend = true;
public pieChartPlugins = [pluginDataLabels];
public pieChartColors = [
  {
    backgroundColor: ['rgba(255,226,154)', 'rgba(205,242,239)', 'rgba(240,190,144)' , 'rgba(94,189,156)'],
  },
];
public pieChartOptions1: ChartOptions = {
  responsive: true,
  legend: {
    position: 'top',
  },
};
public pieChartLabels1: Label[] = [['Monterrey'], ['CDMX'], ['Guadalajara'], ['China'], ['Alemania'], ['Argentina'],] ;
public pieChartData1: number[] = [80, 150, 100, 60, 25, 17];
public pieChartType1: ChartType = 'pie';
public pieChartLegend1 = true;
public pieChartPlugins1 = [pluginDataLabels];
public pieChartColors1 = [
  {
    backgroundColor: ['rgba(135,147,216)', 'rgba(247,148,148)', 'rgba(234,189,136)' , 'rgba(174,141,226)', 'rgba(149,206,120)' , 'rgba(249,240,160)'],
  },
];

}
