import { Component } from '@angular/core';
import { WorkExperienceService } from '../services/work-experience-service/work-experience.service';
import { WorkExperience } from '../models/work-experience/work-experience.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-workexperience',
  templateUrl: './admin-workexperience.component.html',
  styleUrls: ['./admin-workexperience.component.css']
})
export class AdminWorkexperienceComponent {
  itemCount: number = 0;
  btnTxt: string = "Agregar";
  goalText: string = "";
  isEditing: boolean = false;
  editingId: string | null = null;
  workExperience: WorkExperience[] = [];
  myWorkExperience: WorkExperience = new WorkExperience();

  constructor(public workExperienceService: WorkExperienceService) {
    console.log(this.workExperienceService);
    this.workExperienceService.getWorkExperience().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.workExperience = data;
      console.log(this.workExperience);
    });
  }

  AgregarJob() {
            if (this.isEditing && this.editingId) {
              if (confirm("¿estas seguro de actualizar el work Experience?")) {
                this.workExperienceService.updateWorkExperience(this.editingId, this.myWorkExperience).then(() => {
                  console.log('Item updated successfully!');
                  this.resetForm();
                });
              }
            } else {
              if (confirm("¿estas seguro de agregar este nuevo work Experience?")) {
                this.workExperienceService.createWorkExperience(this.myWorkExperience).then(() => {
                  console.log('Created new item successfully!');
                  this.resetForm();
                });
              }
            }
          }
          
          
          resetForm() {
            this.myWorkExperience = new WorkExperience();
            this.btnTxt = "Agregar";
            this.isEditing = false;
            this.editingId = null;
          }
          
          
          deleteJob(id?: string) {
            if (confirm("¿estas seguro de eliminar este work Experience?")) {
              this.workExperienceService.deleteWorkExperience(id).then(() => {
                console.log('Item deleted successfully!');
              });
              console.log(id);
            }
          }
          
          updateJob(id?: string) {
            const certToEdit = this.workExperience.find(cert => cert.id === id);
            if (certToEdit) {
              this.myWorkExperience = { ...certToEdit }; 
              this.isEditing = true;
              this.editingId = id || null;
              this.btnTxt = "Actualizar";
            }
          }



}

