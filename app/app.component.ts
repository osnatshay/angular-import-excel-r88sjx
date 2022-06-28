import { Component, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'my-app',
  template: `
    <input type="file" (change)="onChange($event)" #inputFile> <button (click)="removeData()">Remove Data</button>
    <div *ngIf="isExcelFile === false">
      This is not an Excel file
    </div>
   
        <span *ngIf="spinnerEnabled" class="k-i-loading k-icon"></span>
        {{list1}} 
        <div class="container-network">
      {{cauntEdge}}
      {{edgeCaunt| json}}
        </div>
      
        
  `,
  styleUrls:['./app.component.scss']
})

export class AppComponent {
  spinnerEnabled = false;
  keys: string[];
  dataSheet = new Subject();
  keys1: string[];
  list1;
  dataSheet1 : Network1[];
  dataSheet2 : Network2[];
  edgeCaunt: EdgeCuont[]=[];
  cauntEdge:number = 0;
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;

  onChange(evt) {
    let data,data1, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws);

        const wsname1: string = wb.SheetNames[1];
        const ws1: XLSX.WorkSheet = wb.Sheets[wsname1];

        /* save data */
        data1 = XLSX.utils.sheet_to_json(ws1);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data);
        this.keys1 = Object.keys(data1[0]);
        this.dataSheet1 = data;
        this.dataSheet2 = data1;
        this.dataSheet2.forEach((d1) => {
          this.cauntEdge=0;
          this.dataSheet2.forEach((d2)=>{
            if(d1.source==d2.source && d1.target==d2.target )
            {
              this.cauntEdge++;
            } 
          });
          console.log(this.cauntEdge);
         
          this.edgeCaunt.push({target:d1.target, source: d1.source, cuontEdge:this.cauntEdge });
          console.log(this.edgeCaunt);
        });

        
        
      }
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }


  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = null;
  }

}
