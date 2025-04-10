import { Component } from '@angular/core';
import { HeaderService } from '../services/header-service/header.service';
import { Header } from '../models/header/header.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
	itemCount: number = 0;
  btnTxt: string = "Agregar";
  goalText: string = "";
  isEditing: boolean = false;
  editingId: string | null = null;
  header: Header[] = [];
  myHeader: Header = new Header();

  constructor(public headerService: HeaderService) {
    console.log(this.headerService);
    this.headerService.getHeader().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.header = data;
      console.log(this.header);
    });
  }

   AgregarJob() {
      if (this.isEditing && this.editingId) {
        if (confirm("¿estas seguro de actualizar el header?")) {
          this.headerService.updateHeader(this.editingId, this.myHeader).then(() => {
            console.log('Item updated successfully!');
            this.resetForm();
          });
        }
      } else {
        if (confirm("¿estas seguro de agregar este nuevo header?")) {
          this.headerService.createHeader(this.myHeader).then(() => {
            console.log('Created new item successfully!');
            this.resetForm();
          });
        }
      }
    }
    
    
    resetForm() {
      this.myHeader = new Header();
      this.btnTxt = "Agregar";
      this.isEditing = false;
      this.editingId = null;
    }
    
    
    deleteJob(id?: string) {
      if (confirm("¿estas seguro de eliminar este header?")) {
        this.headerService.deleteHeader(id).then(() => {
          console.log('Item deleted successfully!');
        });
        console.log(id);
      }
    }
    
    updateJob(id?: string) {
      const certToEdit = this.header.find(cert => cert.id === id);
      if (certToEdit) {
        this.myHeader = { ...certToEdit }; 
        this.isEditing = true;
        this.editingId = id || null;
        this.btnTxt = "Actualizar";
      }
    }



}
