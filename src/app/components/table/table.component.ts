import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() params: Array<string> = [];
  @Input() player1Points: Array<number> = [];
  @Input() player2Points: Array<number> = [];
  constructor() { }

  ngOnInit(): void {
    console.log(this.params);
    console.log(this.player1Points);
    console.log(this.player2Points);
  }

}
