import { Component } from '@angular/core';
import { LanguagesService } from '../services/languages-service/languages.service';
import { Languages } from '../models/languages/languages.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-languages',
  templateUrl: './admin-languages.component.html',
  styleUrl: './admin-languages.component.css'
})
export class AdminLanguagesComponent {
	itemCount: number = 0;
  btnTxt: string = "Agregar";
  goalText: string = "";
  isEditing: boolean = false;
  editingId: string | null = null;
  languages: Languages[] = [];
  myLanguages: Languages = new Languages();

  constructor(public languagesService: LanguagesService) {
    console.log(this.languagesService);
    this.languagesService.getLanguages().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.languages = data;
      console.log(this.languages);
    });
  }

  AgregarJob() {
        if (this.isEditing && this.editingId) {
          if (confirm("¿estas seguro de actualizar el language?")) {
            this.languagesService.updateLanguages(this.editingId, this.myLanguages).then(() => {
              console.log('Item updated successfully!');
              this.resetForm();
            });
          }
        } else {
          if (confirm("¿estas seguro de agregar este nuevo language?")) {
            this.languagesService.createLanguages(this.myLanguages).then(() => {
              console.log('Created new item successfully!');
              this.resetForm();
            });
          }
        }
      }
      
      
      resetForm() {
        this.myLanguages = new Languages();
        this.btnTxt = "Agregar";
        this.isEditing = false;
        this.editingId = null;
      }
      
      
      deleteJob(id?: string) {
        if (confirm("¿estas seguro de eliminar este language?")) {
          this.languagesService.deleteLanguages(id).then(() => {
            console.log('Item deleted successfully!');
          });
          console.log(id);
        }
      }
      
      updateJob(id?: string) {
        const certToEdit = this.languages.find(cert => cert.id === id);
        if (certToEdit) {
          this.myLanguages = { ...certToEdit }; 
          this.isEditing = true;
          this.editingId = id || null;
          this.btnTxt = "Actualizar";
        }
      }


}
