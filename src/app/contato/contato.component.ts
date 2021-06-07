import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContatoService} from '../contato.service';
import {Contato} from './contato';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ContatoDetalheComponent} from '../contato-detalhe/contato-detalhe.component';
import {PageEvent} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato[] = [];
  colunas = ['foto', 'id', 'nome', 'email', 'favorito'];
  totalElements = 0;
  page = 0;
  size = 2;
  pageSizeOptions: number[] = [10];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.listContacts(this.page, this.size);
  }

  createForm(): void {
    this.formulario = this.fb.group({
      // primeiro parametro é inicialização
      // segundo é validators
      nome: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    });
  }

  listContacts(page = 0, size = 2): void {
    this.service.list(page, size)
      .subscribe(response => {
        this.contatos = response.content;
        this.totalElements = response.totalElements;
        this.page = response.number;
      });
  }

  favourite(contato: Contato): void {
    this.service.favourite(contato)
      .subscribe(response => {
        contato.favorito = !contato.favorito;
      });
  }

  submit(): void {
    const formValues = this.formulario.value;

    const contato: Contato = new Contato(formValues.nome, formValues.email);

    this.service.save(contato)
      .subscribe(response => {
        this.listContacts();
        this.snackBar.open('Contato adicionado!', 'Sucesso', {
          duration: 2000
        });
        this.formulario.reset();
      });
  }

  uploadPhoto(event, contato: Contato): void {
    const files = event.target.files;
    if (files) {
      const foto = files[0];
      const formData: FormData = new FormData();
      formData.append('foto', foto);
      this.service.upload(contato, formData)
        .subscribe(response => this.listContacts());
    }
  }

  paginator(event: PageEvent): void {
    this.page = event.pageIndex;
    this.listContacts(this.page, this.size);
  }

  viewContact(contato: Contato): void {
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px',
      height: '400px',
      data: contato
    });
  }
}
