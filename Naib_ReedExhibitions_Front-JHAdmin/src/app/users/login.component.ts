import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './models/user';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Evento } from './models/userEvento';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLoginH: FormGroup;
  user: User;
  evento: Evento;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private spinner: NgxSpinnerService) {
    this.user = new User();
  }

  ngOnInit(): void {
    document.body.style.backgroundImage = "url(./assets/img_login/fondo.png)";
    this.validFormLogin();
    this.authenticated();
  }

  private validFormLogin() {
    this.formLoginH = this.fb.group({
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      password: ['', Validators.required]
    })
  }

  login() {
    this.spinner.show();
    this.user.email = this.formLoginH.value.email;
    this.user.password = this.formLoginH.value.password;
    this.authService.login(this.user).subscribe(response => {
      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);
      let userH = this.authService.user;
      if (userH.rol == 'ROLE_ADMINVENTAS' || userH.rol == 'ROLE_VENTAS') {
        this.authService.userEventoVendedor().subscribe((ev) => {
          if (ev.length > 0) {
            this.authService.saveEventoVendedor(ev);
            this.spinner.hide();
            this.rolRedirect(userH.rol);
          } else {
            this.spinner.hide();
            this.alertSinAcceso(userH.nombre, userH.aPaterno);
          }
        }, errorEV => {
          this.errorSts(errorEV);
        });
      } else {
        this.authService.userEvento().subscribe((h) => {
          this.authService.saveEvento(JSON.stringify(h));
          this.spinner.hide();
          if (h.status == 1) {
            this.rolRedirect(userH.rol);
          } else if (h.status == 0) {
            this.alertSinAcceso(userH.nombre, userH.aPaterno);
          }
        }, errorE => {
          this.errorSts(errorE);
        });
      }
    }, error => {
      if (error.status == 400) {//Error 400
        this.spinner.hide();
        Swal.fire({
          icon: 'info',
          title: 'Credenciales incorrectas',
          showConfirmButton: false,
          timer: 1500
        })
      } else if (error.status == 401) {//Error 401
        this.spinner.hide();
        Swal.fire({
          icon: 'info',
          title: 'Credenciales incorrectas',
          showConfirmButton: false,
          timer: 1500
        })
      } else if (error.status == 0) {
        this.spinner.hide();
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success btn-sm'
          },
          buttonsStyling: false
        })
        Swal.fire({
          customClass: {
            confirmButton: 'btn btn-info btn-sm'
          },
          title: "",
          buttonsStyling: false,
          html: "<img src='./assets/img_project/excepciones/errorConexion.jpg' class='img-fluid' alt='Error de conexion'>",
          confirmButtonText: 'Entiendo'
        })
      }

    }
    );
  }

  private rolRedirect(x: any) {
    let h = x.toString();
    switch (h) {
      case 'ROLE_FM':
        this.router.navigate(['/listaExpositores']);
        break;
      case 'ROLE_ADMINFM':
        this.router.navigate(['/misFloorManagers']);
        break;
      case 'ROLE_RV':
        this.router.navigate(['/mapaVentas']);
        break;
      case 'ROLE_ADMINVENTAS':
        this.router.navigate(['/ventasProspectos']);
        break;
      case 'ROLE_VENTAS':
        this.router.navigate(['/ventasProspectos']);
        break;
    }
  }

  private authenticated() {
    if (this.authService.isAuthenticated()) {
      this.rolRedirect(this.authService.user.rol);
    }
  }

  private errorSts(errorE) {
    if (errorE.status == 400) {//Error 400
      this.spinner.hide();
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Ocurrio un problema, intenta más tarde',
        showConfirmButton: false,
        timer: 1500
      })
    } else if (errorE.status == 404) {
      this.spinner.hide();
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Ocurrio un problema, intenta más tarde',
        showConfirmButton: false,
        timer: 1500
      })
    } else if (errorE.status == 0) {
      this.spinner.hide();
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success btn-sm'
        },
        buttonsStyling: false
      })
      Swal.fire({
        customClass: {
          confirmButton: 'btn btn-info btn-sm'
        },
        title: "",
        buttonsStyling: false,
        html: "<img src='./assets/img_project/excepciones/errorConexion.jpg' class='img-fluid' alt='Error de conexion'>",
        confirmButtonText: 'Entiendo'
      })
    }
  }

  private alertSinAcceso(nombre, apellido) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success btn-sm'
      },
      buttonsStyling: false
    })
    Swal.fire({
      customClass: {
        confirmButton: 'btn btn-info btn-sm'
      },
      buttonsStyling: false,
      icon: 'info',
      title: 'Importante',
      html: "<div class='container text-justify '>Estimado usuario <strong class='text-dark'>" + nombre + " " + apellido + "</strong>."
        + "<br> Le informamos que actualmente su cuenta se encuentra sin acceso, ya que no cuenta con alguna invitación a un evento. </div>",
      confirmButtonText: 'Entiendo'
    })
    this.authService.logout();
  }
}
