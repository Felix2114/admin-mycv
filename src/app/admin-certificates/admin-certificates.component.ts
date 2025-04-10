import { Component } from '@angular/core';
import { CertificatesService } from '../services/certificates-service/certificates.service';
import { Certificates } from '../models/certificates/certificates.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-certificates',
  templateUrl: './admin-certificates.component.html',
  styleUrl: './admin-certificates.component.css'
})
export class AdminCertificatesComponent {
  itemCount: number = 0;
  btnTxt: string = "Agregar";
  goalText: string = "";
  isEditing: boolean = false;
editingId: string | null = null;

  certificates: Certificates[] = [];
  myCertificates: Certificates = new Certificates();

  constructor(public certificatesService: CertificatesService) {
    console.log(this.certificatesService);
    this.certificatesService.getCertificates().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.certificates = data;
      console.log(this.certificates);
    });
  }

  AgregarJob() {
  if (this.isEditing && this.editingId) {
    if (confirm("¿estas seguro de actualizar el certificado?")) {
      this.certificatesService.updateCertificates(this.editingId, this.myCertificates).then(() => {
        console.log('Item updated successfully!');
        this.resetForm();
      });
    }
  } else {
    if (confirm("¿estas seguro de agregar este nuevo certificado?")) {
      this.certificatesService.createCertificates(this.myCertificates).then(() => {
        console.log('Created new item successfully!');
        this.resetForm();
      });
    }
  }
}


resetForm() {
  this.myCertificates = new Certificates();
  this.btnTxt = "Agregar";
  this.isEditing = false;
  this.editingId = null;
}


deleteJob(id?: string) {
  if (confirm("¿estas seguro de eliminar este certificado?")) {
    this.certificatesService.deleteCertificates(id).then(() => {
      console.log('Item deleted successfully!');
    });
    console.log(id);
  }
}

updateJob(id?: string) {
  const certToEdit = this.certificates.find(cert => cert.id === id);
  if (certToEdit) {
    this.myCertificates = { ...certToEdit }; 
    this.isEditing = true;
    this.editingId = id || null;
    this.btnTxt = "Actualizar";
  }
}




}
