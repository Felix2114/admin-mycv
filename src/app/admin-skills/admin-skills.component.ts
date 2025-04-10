import { Component } from '@angular/core';
import { SkillsService } from '../services/skills-service/skills.service';
import { Skills } from '../models/skills/skills.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.css'
})
export class AdminSkillsComponent {

  itemCount: number = 0;
  btnTxt: string = "Agregar";
  goalText: string = "";
  isEditing: boolean = false;
  editingId: string | null = null;
  skills: Skills[] = [];
  mySkills: Skills = new Skills();

  constructor(public skillsService: SkillsService) {
    console.log(this.skillsService);
    this.skillsService.getSkills().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.skills = data;
      console.log(this.skills);
    });
  }

  AgregarJob() {
          if (this.isEditing && this.editingId) {
            if (confirm("¿estas seguro de actualizar el skills?")) {
              this.skillsService.updateSkills(this.editingId, this.mySkills).then(() => {
                console.log('Item updated successfully!');
                this.resetForm();
              });
            }
          } else {
            if (confirm("¿estas seguro de agregar este nuevo skill?")) {
              this.skillsService.createSkills(this.mySkills).then(() => {
                console.log('Created new item successfully!');
                this.resetForm();
              });
            }
          }
        }
        
        
        resetForm() {
          this.mySkills = new Skills();
          this.btnTxt = "Agregar";
          this.isEditing = false;
          this.editingId = null;
        }
        
        
        deleteJob(id?: string) {
          if (confirm("¿estas seguro de eliminar este skill?")) {
            this.skillsService.deleteSkills(id).then(() => {
              console.log('Item deleted successfully!');
            });
            console.log(id);
          }
        }
        
        updateJob(id?: string) {
          const certToEdit = this.skills.find(cert => cert.id === id);
          if (certToEdit) {
            this.mySkills = { ...certToEdit }; 
            this.isEditing = true;
            this.editingId = id || null;
            this.btnTxt = "Actualizar";
          }
        }


}
