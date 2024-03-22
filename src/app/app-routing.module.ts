import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoginGuard } from './core/guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home',  loadChildren: () => import('./home/home.module').then(x => x.HomePageModule) },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(x => x.LoginPageModule),
    canLoad: [LoginGuard]
  },
  { path: 'signup', loadChildren: () => import('./signup/signup.module').then(x => x.SignupPageModule) },
  // { path: 'passwordreset', loadChildren: () => import('./passwordreset/passwordreset.module').then(x => x.PasswordresetPageModule) },
  // { path: 'list', loadChildren: () => import('./list/list.module').then(x => x.ListPageModule) },
  // { path: 'infomodal', loadChildren: () => import('./infomodal/infomodal.module').then(x => x.InfomodalPageModule) },
  { path: 'cart', loadChildren: () => import('./cart/cart.module').then(x => x.CartPageModule) },
  { path: 'productdetail/:id', loadChildren: () => import('./productdetail/productdetail.module').then(x => x.ProductdetailPageModule) },
  { path: 'productlist', loadChildren: () => import('./productlist/productlist.module').then(x => x.ProductlistPageModule) },
  { path: 'search', loadChildren: () => import('./search/search.module').then(x => x.SearchPageModule) },
  // { path: 'notification', loadChildren: () => import('./notification/notification.module').then(x => x.NotificationPageModule) },
  // { path: 'NewAddress/:id', loadChildren: () => import('./new-address/new-address.module').then(x => x.NewAddressPageModule) },
  { path: 'Checkout', loadChildren: () => import('./checkout/checkout.module').then(x => x.CheckoutPageModule) },
  // { path: 'wishcash', loadChildren: () => import('./wishcash/wishcash.module').then(x => x.WishcashPageModule) },
  // { path: 'applypromo', loadChildren: () => import('./applypromo/applypromo.module').then(x => x.ApplypromoPageModule) },
  { path: 'orders', loadChildren: () => import('./orders/orders.module').then(x => x.OrdersPageModule) },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(x => x.CustomersPageModule) },
  { path: 'doanh-thu', loadChildren: () => import('./commission/commission.module').then(x => x.CommissionPageModule) },
  // { path: 'orderinfo', loadChildren: () => import('./orderinfo/orderinfo.module').then(x => x.OrderinfoPageModule) },
  // { path: 'faqs', loadChildren: () => import('./faqs/faqs.module').then(x => x.FaqsPageModule) },
  // { path: 'faq', loadChildren: () => import('./faq/faq.module').then(x => x.FaqPageModule) },
  // { path: 'support', loadChildren: () => import('./support/support.module').then(x => x.SupportPageModule) },
  // { path: 'rewards', loadChildren: () => import('./rewards/rewards.module').then(x => x.RewardsPageModule) },
  // { path: 'settings', loadChildren: () => import('./settings/settings.module').then(x => x.SettingsPageModule) },
  // { path: 'notificationssettings', loadChildren: () => import('./notificationssettings/notificationssettings.module')
  //   .then(x => x.NotificationssettingsPageModule) },
  // { path: 'emailsettings', loadChildren: () => import('./emailsettings/emailsettings.module').then(x => x.EmailsettingsPageModule) },
  // { path: 'addressbook', loadChildren: () => import('./addressbook/addressbook.module').then(x => x.AddressbookPageModule) },
  // { path: 'managepayments', loadChildren: () => import('./managepayments/managepayments.module').then(x => x.ManagepaymentsPageModule) },
  // { path: 'newpayment', loadChildren: () => import('./newpayment/newpayment.module').then(x => x.NewpaymentPageModule) },
  // { path: 'datacontrol', loadChildren: () => import('./datacontrol/datacontrol.module').then(x=>x.DatacontrolPageModule) },
  // { path: 'currencysettings', loadChildren: () => import('./currencysettings/currencysettings.module')
  //  .then(x=>x.CurrencysettingsPageModule) },
  // { path: 'accountsettings', loadChildren: () => import('./accountsettings/accountsettings.module').then(x=>x.AccountsettingsPageModule) },
  // { path: 'country', loadChildren: () => import('./country/country.module').then(x=>x.CountryPageModule) },
  // { path: 'changeemail', loadChildren: () => import('./changeemail/changeemail.module').then(x => x.ChangeemailPageModule) },
  // { path: 'changepassword', loadChildren: () => import('./changepassword/changepassword.module').then(x=>x.ChangepasswordPageModule) },
  { path: 'account', loadChildren: () => import('./account/account.module').then(x=>x.AccountPageModule) },
  { path: 'account-edit',loadChildren: () => import('./account-edit/account-edit.module').then( m => m.AccountEditPageModule)},
  { path: 'account-delete',loadChildren: () => import('./account-delete/account-delete.module').then( m => m.AccountDeletePageModule)},
  { path: 'account-point',loadChildren: () => import('./account-point/account-point.module').then( m => m.AccountPointPageModule)},
  { path: 'point-history',loadChildren: () => import('./point-histories/point-histories.module').then( m => m.PointHistoriesPageModule)},
  { path: 'info-app',loadChildren: () => import('./info-app/info-app.module').then( m => m.InfoAppPageModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
