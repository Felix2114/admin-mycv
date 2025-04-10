import { Component } from '@angular/core';
import { InterestsService } from '../services/interests-service/interests.service';
import { Interests } from '../models/interests/interests.model';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
  styleUrl: './admin-interests.component.css'
})
export class AdminInterestsComponent {
	itemCount: number = 0;
  btnTxt: string = "Agregar";
  goalText: string = "";
  isEditing: boolean = false;
  editingId: string | null = null;
  interests: Interests[] = [];
  myInterests: Interests = new Interests();

  constructor(public interestsService: InterestsService) {
    console.log(this.interestsService);
    this.interestsService.getInterests().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.interests = data;
      console.log(this.interests);
    });
  }


AgregarJob() {
      if (this.isEditing && this.editingId) {
        if (confirm("¿estas seguro de actualizar el interests?")) {
          this.interestsService.updateInterests(this.editingId, this.myInterests).then(() => {
            console.log('Item updated successfully!');
            this.resetForm();
          });
        }
      } else {
        if (confirm("¿estas seguro de agregar este nuevo interests?")) {
          this.interestsService.createInterests(this.myInterests).then(() => {
            console.log('Created new item successfully!');
            this.resetForm();
          });
        }
      }
    }
    
    
    resetForm() {
      this.myInterests = new Interests();
      this.btnTxt = "Agregar";
      this.isEditing = false;
      this.editingId = null;
    }
    
    
    deleteJob(id?: string) {
      if (confirm("¿estas seguro de eliminar este interests?")) {
        this.interestsService.deleteInterests(id).then(() => {
          console.log('Item deleted successfully!');
        });
        console.log(id);
      }
    }
    
    updateJob(id?: string) {
      const certToEdit = this.interests.find(cert => cert.id === id);
      if (certToEdit) {
        this.myInterests = { ...certToEdit }; 
        this.isEditing = true;
        this.editingId = id || null;
        this.btnTxt = "Actualizar";
      }
    }


}
