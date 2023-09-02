import { Component, ElementRef, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild } from '@angular/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-read-file',
  templateUrl: './read-file.component.html',
  styleUrls: ['./read-file.component.css']
})
export class ReadFileComponent implements OnInit {

  file: any;
  fileUrl: any;
  params: string[] = [];
  player1Points: number[] = [];
  player2Points: number[] = [];
  differencesArray: number[] = [];
  winner: number = 0;
  downloadableFile = false;

  @ViewChild('myInfileFieldput') myInputVariable!: ElementRef;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
  }

  obtainParamsFromFile = (e:any) => {
    this.file = e.target.files[0];

    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      // console.log(fileReader.result?.toString().split(/[\r\n]+/g));
      this.params = fileReader.result!.toString().split(/[\r\n]+/g);
      console.log(this.params);
    }
    fileReader.readAsText(this.file);

    fileReader.onloadend = (i) => {

      let rounds = parseInt(this.params[0]);
      console.log(rounds)
      console.log(this.params.length-1)
      const Swal = require('sweetalert2');

      if(rounds <= 10000 && rounds == this.params.length-1)
      {
        this.params = this.params.filter((item,index) => index!=0 );
        this.obtainingDifferences(this.params);
        // this.myInputVariable.nativeElement.value = "";
        // console.log(this.myInputVariable)
        this.downloadableFile = true;
      }
      else
      {
        Swal.fire({
          title: '¡Error!',
          text: 'El numero de rondas debe ser menor o igual a 10000 y debe coincidir con la lista de puntuaciones',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
        return;
      }

      e.target.value = "";

    }
  }

  obtainingDifferences = (params:string[]) =>{
    // console.log(this.params)
    let paramInPairs: string[];
    let val1: number;
    let val2: number;

    this.params.map(item => {
      paramInPairs = item.split(' ');

      val1= parseInt(paramInPairs[0]);
      val2= parseInt(paramInPairs[1]);

      this.differencesArray.push(Math.abs(val1-val2));

      this.player1Points.push(val1);
      this.player2Points.push(val2);
    });

    this.reviewOfDifferences();
  }

  reviewOfDifferences = () =>{

    console.log(this.differencesArray)
    console.log(this.player1Points)
    console.log(this.player2Points)

    const maxValue = Math.max(...this.differencesArray);
    const indexMaxValue = this.differencesArray.indexOf(maxValue);

    console.log(indexMaxValue);

    const val1 = this.player1Points[indexMaxValue];
    const val2 = this.player2Points[indexMaxValue];
    
    if(val1>val2)
    {
      this.winner = 1;
    }
    else
    {
      this.winner = 2;
    }

    this.generateDownloableFile(maxValue);
  }

  generateDownloableFile = (maxValue: number) =>{
    let outputInfo = `${this.winner.toString()} ${maxValue.toString()}`;
    
    const blob = new Blob([outputInfo], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  checkIfDownloadableFileExists = () =>{
    if(!this.downloadableFile)
    {
      return;
    }
    this.downloadableFile = false;
  }

}
