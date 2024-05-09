import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parking.component.html',
  styleUrl: './parking.component.css'
})
export class ParkingComponent implements OnInit {
  masterServices = inject(MasterService);
  parkingLotList: any[] = [];
  parkingList:any[]=[]
  selectedParkingLot: any = {};
  parkingSpotList: number[] = [];
  selectedParkingSpotNo: number = 0;
  selectParkingObj:any ={};
  selectParkingLot:any={};
  selectParkingLotName:string="";
  lotObj:any={
    "parkingLotId": 0,
    "parkingLotName": "string",
    "isActive": true,
    "totalParkingSpot": 0
  }
  bookingObj: any = {

    "parkingId": 0,
    "parkingLotId": 0,
    "vehicleNo": "",
    "mobileNo": "",
    "inTime": "",
    "outTime": "",
    "parkingDate": new Date(),
    "spotNo": 0
  }

  ngOnInit(): void {
    this.getParkingLots();
  }
  getParkingLots() {
    this.masterServices.getAllParkingLots().subscribe((res: any) => {
      this.parkingLotList = res.data;
      this.selectedParkingLot = this.parkingLotList[0];
      this.getActiveParking();
      this.createList(this.selectedParkingLot.totalParkingSpot);
    })
  }
  getActiveParking() {
    this.masterServices.getActiveParkingByParkingLotId(this.selectedParkingLot.parkingLotId).subscribe((res: any) => {
      this.parkingList = res.data;
    })
  }
  setSelectedParkingLot(data: any) {
    this.selectedParkingLot = data;
    this.createList(this.selectedParkingLot.totalParkingSpot);
    this.getActiveParking();

  }
  createList(totalSpot: number) {
    this.parkingSpotList = [];
    for (let index = 1; index <= totalSpot; index++) {
      this.parkingSpotList.push(index);

    }
  }

  openModel(parkingSpotNo: number) {
    this.selectedParkingSpotNo = parkingSpotNo;
    const model = document.getElementById("bookModal");
    if (model != null) {
      model.style.display = 'block';
    }
  }
  
  openReleaseModel(parkingObj: any) 
  {
    this.selectParkingObj = parkingObj;
    const model = document.getElementById("releaseBookModal");
    if (model != null) 
      {
      model.style.display = 'block';
      }
  }

  closeModel() {
    const model = document.getElementById("bookModal");
    if (model != null) {
      model.style.display = 'none';
    }
  }
  closeReleaseModel() {
    const model = document.getElementById("releaseBookModal");
    if (model != null) {
      model.style.display = 'none';
    }
  }

  onBook() {
    this.bookingObj.parkingLotId = this.selectedParkingLot.parkingLotId;
    this.bookingObj.spotNo = this.selectedParkingSpotNo;
    this.masterServices.bookSpot(this.bookingObj).subscribe((res: any) => {

      if (res.result) {
        alert("Booking Done");
        this.closeModel();
        this.getActiveParking();
      }
      else {
        alert(res.message);
      }
    });
  }
 
    checkIfParkingSpotBooked(spotNo:number)
    {
           return this.parkingList.find(m=>m.spotNo == spotNo)
    } 
    
    releaseSpot()
    {
      this.masterServices.releaseSpot(this.selectParkingObj).subscribe((res: any) => {

        if (res.result) {
          alert("Spot Released");
          this.closeReleaseModel();
          this.getActiveParking();
        }
        else {
          alert(res.message);
        }
      });
    }

    createNewParkingLot()
    {
      this.lotObj.parkingLotId = this.selectedParkingLot.parkingLotId;
    this.lotObj.parkingLotName = this.selectParkingLotName;
      this.masterServices.createNewParkingLot(this.lotObj).subscribe((res:any)=>
      {
        if(res.result)
        {
          alert("Parking Lot Created");
          this.closeModel();
          this.getActiveParking();
        }
        else
        {
          alert(res.message);
        }
      })
    }
    
}
