import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { TemplesComponent } from './components/temples/temples.component';
import { GetbytemplesComponent } from './components/getbytemples/getbytemples.component';
import { GoshalaComponent } from './components/goshala/goshala.component';
import { EventComponent } from './components/event/event.component';
// import { GlobaltempleComponent } from './components/globaltemple/globaltemple.component';
import { VillagetemplesComponent } from './components/villagetemples/villagetemples.component';
import { AddtempleComponent } from './components/addtemple/addtemple.component';
import { AddgoshalaComponent } from './components/addgoshala/addgoshala.component';
import { ConnectyourorginComponent } from './components/connectyourorgin/connectyourorgin.component';
import { GetmemberComponent } from './components/member/getmember/getmember.component';
import { AddmemberComponent } from './components/member/addmember/addmember.component';
import { CountryService } from './services/countryservice/country.service';



import { DetailvieweventComponent } from './components/detailviewevent/detailviewevent.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { AddeventComponent } from './components/addevent/addevent.component';
import { GetbygoshalaComponent } from './components/getbygoshala/getbygoshala.component';
import { AboutsComponent } from './components/abouts/abouts.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { PujariComponent } from './components/pujari/pujari.component';
import { VerifyComponent } from './components/verify/verify.component';
import { LoggedinguardGuard } from './guards/login.guard';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { ConnectionsComponent } from './components/connections/connections/connections.component';
import { TemplechatComponent } from './components/chatroom/templechat/templechat.component';
import { AddvillageComponent } from './components/addvillage/addvillage/addvillage.component';
import { ConnectyourtempleComponent } from './components/connectyourtemple/connectyourtemple/connectyourtemple.component';
import { VisionmissionComponent } from './components/vision/mission/visionmission/visionmission.component';
import { UpdateprofileComponent } from './components/updateprofile/updateprofile.component';
import { UserService } from './services/userservice/user.service';
import { AddSpaceComponent } from './components/add-space/add-space.component';
import { AddSpace1Component } from './components/add-space1/add-space1.component';
import { HeaderComponent } from './components/header/header.component';
import { ChatgroupsComponent } from './components/chatgroups/chatgroups.component';
import { ShareTempleComponent } from './components/share-option/share-temple/share-temple.component';
import { VillagechatComponent } from './components/villagechat/villagechat.component';
import { AddvoluantryComponent } from './components/member/addvoluantry/addvoluantry.component';
import { DistrictsviewComponent } from './components/districtsview/districtsview.component';
import { MandalviewComponent } from './components/mandalview/mandalview.component';
import { TempleviewComponent } from './components/templeview/templeview.component';
import { UserprofileComponent } from './components/userprofile/userprofile.component';
import { AlltemplesComponent } from './components/alltemples/alltemples.component';
import { StatewiseTemplesPageComponent } from './components/statewise-temples-page/statewise-temples-page.component';
import { TourismPlacesComponent } from './components/tourism-places/tourism-places.component';
import { TourismComponent } from './components/tourism/tourism.component';
import { VillageComponent } from './components/village/village.component';
import { AddTourismComponent } from './components/add-tourism/add-tourism.component';
import { WelfareHomesComponent } from './components/welfare-homes/welfare-homes.component';
import { DetailViewWelfareHomesComponent } from './components/detail-view-welfare-homes/detail-view-welfare-homes.component';
import { AddWelfareHomeComponent } from './components/add-welfare-home/add-welfare-home.component';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { VertinaryHospitalsComponent } from './components/vertinary-hospitals/vertinary-hospitals.component';
import { PoojastoresComponent } from './components/poojastores/poojastores.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { HospitalsComponent } from './components/hospitals/hospitals.component';
import { BloodbanksComponent } from './components/bloodbanks/bloodbanks.component';
import { TourOperatorComponent } from './components/tour-operator/tour-operator.component';
import { AddPoojaStoresComponent } from './components/add-pooja-stores/add-pooja-stores.component';
import { AddBloddBankComponent } from './components/add-blodd-bank/add-blodd-bank.component';
import { AddVerticnaryComponent } from './components/add-verticnary/add-verticnary.component';
import { AddTourOperatorComponent } from './components/add-tour-operator/add-tour-operator.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: "home",component:HomeComponent},
    {path: "signup",component:SignupComponent},
    { path: 'temples/:id', component: TemplesComponent },
    { path: 'getbytemples/:id',component: GetbytemplesComponent},
    { path: 'getbygoshala/:id',component:GetbygoshalaComponent},
    // { path: 'goshala/:id',component:GoshalaComponent},
    // { path: 'events/:id', component: EventComponent },
    // { path: 'globaltemples/:id',component:GlobaltempleComponent},
    // { path: "villages/:_id",component:VillagetemplesComponent},
    // { path: "addtemple", component:AddtempleComponent},
    // { path: 'addgoshala',component:AddgoshalaComponent},
    { path: 'connectorgin',component:ConnectyourorginComponent},
    { path:'getmember',component:GetmemberComponent},
    { path: 'addmember',component:AddmemberComponent},



    {path: 'detailviewevent/:id',component:DetailvieweventComponent},
    {path: 'tree',component:TreeViewComponent},
    // { path: 'addevent',component:AddeventComponent},
    {path: "aboutus",component:AboutsComponent},
    {path:"chatroom/:id",component:ChatroomComponent},
    {path: 'addpujari',component:PujariComponent},
    {path: 'verify',component:VerifyComponent},
    {path: 'profile/:id',component:ProfileComponent},
    {path: 'connections',component:ConnectionsComponent},
    {path: 'templechat/:id',component:TemplechatComponent},
    {path: 'addvillage',component:AddvillageComponent},
    {path:'connectyourtemple',component:ConnectyourtempleComponent,},
    {path: 'vision/mision',component:VisionmissionComponent},
    {path: 'updateprofile',component:UpdateprofileComponent},
    {path:'addspace',component:AddSpaceComponent},
    {path: 'addspce1',component:AddSpace1Component},
    {path: 'header', component:HeaderComponent},
    {path:'addvoluanter',component:AddvoluantryComponent},
    {path:'district-details/:id',component:DistrictsviewComponent},
    {path:'mandal-details/:id',component:MandalviewComponent},




    {
        path: 'addtemple',
        component: AddtempleComponent,
        canActivate: [LoggedinguardGuard],
      },


      {
        path: 'addgoshala',
        component: AddgoshalaComponent,
        canActivate: [LoggedinguardGuard],
      },

      {
        path: 'addevent',
        component: AddeventComponent,
        canActivate: [LoggedinguardGuard],
      },



      {
        path: 'goshala/:id',
        component: GoshalaComponent,
        
      },


      {
        path: 'events/:id',
        component: EventComponent,
       
      },

      {
        path: 'villages/:_id',
        component: VillagetemplesComponent,
        // canActivate: [LoggedinguardGuard],
      },

      { path: 'chatgroups/:_id', component: ChatgroupsComponent },


      { path: 'chat', component: VillagechatComponent, canActivate: [LoggedinguardGuard], },
      {path:'templedetailsview/:id',component:TempleviewComponent},
      {path:'userprofile/:id',component:UserprofileComponent},

      {path:'temple/:id',component:AlltemplesComponent},
      {path:'statewisetemples/:id',component:StatewiseTemplesPageComponent},
      {path: 'tourism-places/:id', component: TourismPlacesComponent},
      {path:'tourism',component:TourismComponent},
      {path:'village',component:VillageComponent},
      {path:'Add Tourism',component:AddTourismComponent},
      {path:'Welfare-Homes/:id',component:WelfareHomesComponent},
      {path:'DetailviewofWelfareHome/:id',component:DetailViewWelfareHomesComponent},
      {path:'Welfare-Home-Form',component:AddWelfareHomeComponent},
      {path:'Restaurants',component:RestaurantsComponent},
      {path:'vertinary-hospitals',component:VertinaryHospitalsComponent},
      {path:'pooja-stores',component:PoojastoresComponent},
      {path:'Hotels',component:HotelsComponent},
      {path:'Hospitals',component:HospitalsComponent},
      {path:'Blood-Banks',component:BloodbanksComponent},
      {path:'tour-operator',component:TourOperatorComponent},
      {path:'add-pooja-stores',component:AddPoojaStoresComponent},
      {path:'add-blood-bank',component:AddBloddBankComponent},
      {path:'add-vertinary',component:AddVerticnaryComponent},
      {path:'add-tour-operator',component:AddTourOperatorComponent},

      ];
