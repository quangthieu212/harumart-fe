import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordPageRoutingModule } from './reset-password-routing.module';

import { ResetPasswordPage } from './reset-password.page';
import { ComponentsModule } from '../core/components/components.module';

@NgModule({
    declarations: [ResetPasswordPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ResetPasswordPageRoutingModule,
        ReactiveFormsModule,
        ComponentsModule
    ]
})
export class ResetPasswordPageModule {}
