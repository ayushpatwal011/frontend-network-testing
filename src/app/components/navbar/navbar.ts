import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { IpInfo } from '../../models/tower.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {

  apiService = inject(ApiService);
  ipInfo!: IpInfo;
  isBSNL!: boolean;
  loading: boolean = true;

  ngOnInit(): void {
    this.checkISP();
  }

  private checkISP(): void {  
   this.apiService.getIpInfo().subscribe({
      next: (data: IpInfo) => {
        this.ipInfo = data;
        this.isBSNL = this.apiService.isBSNL(data.org);
        console.log(data);

        if (this.isBSNL) {
          console.log('✅ BSNL network pe ho tum!');
          // Speed test shuru karo
        } else {
          console.log('❌ Yeh BSNL nahi hai:', data.org);
        }
      },
      error: (err: any) => {
        console.log("Error in checkinh ISP");
        
      }
    })
  }
}