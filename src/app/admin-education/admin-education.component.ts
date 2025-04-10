import { Component } from '@angular/core';
import { EducationService } from '../services/education-service/education.service';
import { Education } from '../models/education/education.model';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-admin-education',
  templateUrl: './admin-education.component.html',
  styleUrl: './admin-education.component.css'
})
export class AdminEducationComponent {
  itemCount: number = 0;
  btnTxt: string = "Agregar";
  goalText: string = "";
  isEditing: boolean = false;
  editingId: string | null = null;
  education: Education[] = [];
  myEducation: Education = new Education();

  constructor(public educationService: EducationService) {
    console.log(this.educationService);
    this.educationService.getEducation().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.education = data;
      console.log(this.education);
    });
  }

  AgregarJob() {
    if (this.isEditing && this.editingId) {
      if (confirm("¿estas seguro de actualizar el education?")) {
        this.educationService.updateEducation(this.editingId, this.myEducation).then(() => {
          console.log('Item updated successfully!');
          this.resetForm();
        });
      }
    } else {
      if (confirm("¿estas seguro de agregar esta nueva education?")) {
        this.educationService.createEducation(this.myEducation).then(() => {
          console.log('Created new item successfully!');
          this.resetForm();
        });
      }
    }
  }
  
  
  resetForm() {
    this.myEducation = new Education();
    this.btnTxt = "Agregar";
    this.isEditing = false;
    this.editingId = null;
  }
  
  
  deleteJob(id?: string) {
    if (confirm("¿estas seguro de eliminar esta education?")) {
      this.educationService.deleteEducation(id).then(() => {
        console.log('Item deleted successfully!');
      });
      console.log(id);
    }
  }
  
  updateJob(id?: string) {
    const certToEdit = this.education.find(cert => cert.id === id);
    if (certToEdit) {
      this.myEducation = { ...certToEdit }; 
      this.isEditing = true;
      this.editingId = id || null;
      this.btnTxt = "Actualizar";
    }
  }
}
