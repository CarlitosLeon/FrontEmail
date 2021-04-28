import { Component, OnInit } from '@angular/core';
import { IncidenciaService } from 'src/app/menu-fm/service/incidencia.service';

declare var $: any;

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent implements OnInit {
  public tabAyuda:number=1;
  ////////////////////DEMO/////////////////////
  public providerSelected="";
  public number=0;
  ////////////////////DEMO/////////////////////
  
  constructor(private menu:IncidenciaService) { }

  ngOnInit(): void {
    this.menu.setNombrePantalla("AYUDA");
    this.cambiarTabAyuda(1);
    
  }

  public cambiarTabAyuda(tab:number):void{
    this.tabAyuda=tab;
  }

  public showDetailsContact(empresa:string):void{
    if(this.providerSelected==empresa){
      this.providerSelected="";
      this.number=0;
    }else{
      switch(empresa){
        case 'Telmex':
          this.number=3;
          break;
        case 'Izzi':
          this.number=2;
          break;
        case 'Total Play':
          this.number=1;
          break;
      }
      this.providerSelected=empresa;
    }
  }


}
