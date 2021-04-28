import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { ContactoExpositor } from 'src/app/models/ContactoExpositor';
import { EmailContacto } from 'src/app/models/EmailContacto';
import { VentasProspectosComponent } from '../../ventas-prospectos/ventas-prospectos.component';
import { VentasProspectosService } from  '../../ventas-prospectos/ventas-prospectos.component.service'
import Swal from 'sweetalert2';
import $ from 'jquery';
import { FirmaEmail } from 'src/app/models/FirmaEmail';
export interface idFirmas {
  id: number
}
@Component({
  selector: 'app-email-masivos',
  templateUrl: './email-masivos.component.html',
  styleUrls: ['./email-masivos.component.css']
})
export class EmailMasivosComponent implements OnInit {
  @ViewChild(VentasProspectosComponent) ventasP : VentasProspectosComponent;
  
    /**S u m e r n o t e C o n f i g */
  config: any = {
    placeholder:'Escriba Aqui',
    tabsize:2,
    height:'335px',
    width:'700px',
    airMode: false,
    tabDisable: true,
    popover: {
      table: [
        ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
        ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
      ],
      image: [
        ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
        ['float', ['floatLeft', 'floatRight', 'floatNone']],
        ['remove', ['removeMedia']]
      ],
      link: [
        ['link', ['linkDialogShow', 'unlink']]
      ],
      air: [
        [
          'font',
          [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'clear'
          ]
        ],
      ]
    },
    uploadImagePath: 'canvas/uploadimg',
    toolbar: [
     /* ['misc', ['undo', 'redo']],*/
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear'
        ]
      ],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph']],
      ['insert', ['picture'/*, 'link'*/]],
      ['customButtons', ['testBtn']]
    ],
    /*buttons: {
      testBtn: this.customButton
    },*/
    codeviewFilter: true,
    codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
    codeviewIframeFilter: true
  };
   /**F i n S u me r n o t e C o n f i g */

 // ID EVENTO SELECCIONADO
 public idEventoSelected: number;
 // C L I E N T E S
 public misClientes: any = [];
 public misEmails: any = [];

 formEmail: FormGroup;
 saveEmail: EmailContacto = new EmailContacto();

 /**Ver Firmas */
firmasEmail: FirmaEmail[];



 /** */
 public contactoCliente: any = [];
 /**Archivos */
 public nombrePdf: string = "";
 public size: string = "";
 public tipoAr: string = "";
 private archivosM: File;
 private archivosE : File[]=[];
 public archivosFirma: Array<{ archivo: File, name: string, size: string, tipoAr: string }> = [];
 /** */

  constructor(
    private ventasService: VentasProspectosService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.idEventoSelected = 1;
    this.verFirma();
    this.veremailContacto();
    this.ValidEmail();
    this.miEmail();
  }

  /**Ver Email */
  emailShow: string[] = [];
  private dataEmail: Array<ContactoExpositor> = new Array<ContactoExpositor>();
  public veremailContacto() {
    this.ventasService.getEcontactoEx().subscribe((result) => {
      if (result.length == 0) {
        return this.misClientes = null;
      }
      this.misClientes = result;
      /**Sleccionar Todos Emails */
      result.forEach(e => {
           this.dataEmail.push({id: e.id,expositor: e.expositor, nombre: e.nombre, telefono: e.telefono, email: e.email, img: e.img, checked: false})
      });
      //console.log(this.dataEmail);
      
      result.forEach(h => {
        let show = h.email;
        if(!show){
          this.emailShow.push(show);
          
        }
        
      })
     
      
      this.checkTrue = this.dataEmail;
    }
     
    );   
  }
  /** */
  valiPais:string[] =[];
  valiEstado:string[] =[];
  emailSho: string[] = [];
  private dataEmal: Array<ContactoExpositor> = new Array<ContactoExpositor>();
  miEmail(){

    this.ventasService.getMisExpositores(this.idEventoSelected).subscribe((result)=>{
      if(result.length === 0){
        return this.misEmails = null;
      }

      this.misEmails = result;
     

      result.forEach(p =>{
        let vPais = p.expositor.pais;
        if(vPais){
          this.valiPais.push(vPais);
        }
      });

      result.forEach(e =>{
        let vEstado = e.expositor.estado;
        if(vEstado){
          this.valiEstado.push(vEstado);
        }
      });

     result.forEach((e:any)=> {       
        let vEmail = e.expositor.contactoExpositor[0];        
        console.log(vEmail);  
          
   });
  })
  }
  
    /** Envio Email Sin Programar*/

private ValidEmail(){
  this.formEmail = this.fb.group({
    firma: [],
    asunto: ['', Validators.required],
    descripcion: ['', Validators.required],
  })
}


public envioEmail(){
  const fecha = new Date(); 
  let idFirma = this.formEmail.controls.firma.value;
  
  
  this.checkTrue.forEach(element => {
    const idExpo = element.id;
    if(element.checked){       
      this.saveEmail.firma = this.firmasEmail.find(f => f.id == idFirma);
      this.saveEmail.asunto = this.formEmail.controls.asunto.value;
      this.saveEmail.descripcion = this.formEmail.controls.descripcion.value;
      this.saveEmail.fecha_programado = fecha;
      this.saveEmail.status = 0;

      /**Guarda mensaje a BD */
      this.ventasService.createCorreo(this.saveEmail, idExpo)
      .subscribe((result) =>{
        let idcEx = result.Email.id;
      // console.log(result);
      /**Guarda Archivos en BD */
      this.archivosE.forEach(archivo =>{  
        this.ventasService.createarchivoContacto(archivo,idcEx)
        .subscribe((result) => {
          
        })
      })
      /**Manda Mensaje y Archivos a Email */
       this.ventasService.sendEmailProgramed(idcEx)
       .subscribe((result) => {
       console.log(result);
       
       }, error =>{
         if(error.status == 500) {
           Swal.fire({
             icon: 'info',
             title: 'Sin Internet',
             showConfirmButton: false,
             timer: 1500
           })
         } 
       }) 

      })
     
    }    
  })
  
}

    /** Seleccionar Todos los Correos*/
    public checkTrue: Array<ContactoExpositor> = new Array<ContactoExpositor>();
    getEmailId(x : ContactoExpositor ){
      this.checkTrue.forEach(element => {
        if(element.email === x.email){
          element.checked =! element.checked;
        }
      });
this.envioemail();
    }
    seleccionarTodo(e){ 
      if(e){
        this.checkTrue.forEach(x => {
          x.checked = true;
        });
      }else{
        this.checkTrue.forEach(x =>{
         x.checked=false
        });
      }
    }
    eCheckedAll(): boolean{
      let veri = 0;
      this.checkTrue.forEach(x => {
        if(x.checked){
          veri += 1;
        }
      });
      if(veri === this.checkTrue.length){
        return true;
      }
      return false;
    }
    public envioemail() {
      let n: number = 0;
      this.checkTrue.forEach(element => {
        if(element.checked){
          n += 1;
        }
      });
      if(n > 0){
        return true;
      }
      return false;
    }


    /**Envio Pdf */
    envioDocumento(evt) {
      this.nombrePdf = "";
      this.size = "";
  
      var files = evt.target.files;
      var file = files[0];
      
      
  
      var extensiones_permitidas = new Array(".pptx",".ppsx",".pps",".xlsx",".odt",".pptx", ".xls", ".docx",".doc",".txt",".pdf",".svg",".ico",".gif",".jpeg",".jpg",".png");
      let extension = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
      let permitida = false;
  
      for (var i = 0; i < extensiones_permitidas.length; i++) {
        if (extensiones_permitidas[i] == extension) {
          permitida = true;
          break;
        }
      } if (!permitida) {
        console.log(extension);
  
        Swal.fire({
          icon: 'error',
          text: 'Extensión no permitida.  \nSólo se pueden subir archivos con extensiones: ' + extensiones_permitidas.join()
        })
      } else if (file.size > "104857600") {
        Swal.fire({
          icon: 'error',
          text: '1 Documento que intentaste añadir es mayor al límite de 100 MB.'
        })
  
      } else if (file.size <= "104857600") {
        
        if (files && file) {
  
        this.archivosM = evt.target.files[0];
        
          this.archivosE.push(evt.target.files[0]);
  
          this.nombrePdf = file.name;
          this.size = file.size;
          this.tipoAr = extension;
          this.archivoFirma();
          //console.log("Nombre: "+ this.nombrePdf + " Peso Archivo: " + this.size + " Tipo: " + this.tipoAr );
          
  
          return 1;
        }
  
      }
    }
    public archivoFirma(){   
      $("#fichero-tarifas").val('');
      this.formatBytes(this.size);
      this.archivosFirma.push({
        archivo:this.archivosM,
        name:this.nombrePdf,
        size:this.formatBytes(this.size),
        tipoAr: this.tipoAr
      });
    }

    public formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
  
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
      const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  
  
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    deleteArchivo(i:number){
      this.archivosFirma.splice(i,1);
      this.archivosE.splice(i,1);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Archivo Eliminado !!',
        showConfirmButton: false,
        timer: 1500
      })
     
    }

    /**Ver Firmas Check */
    public verFirma() {
      this.ventasService.getFirmas().subscribe(
        firmasEmail => this.firmasEmail = firmasEmail
      );
    }
    /** */
public onEditClick(e){
 console.log(e);
 
}
}
