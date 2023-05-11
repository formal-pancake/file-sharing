import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PopupComponent } from '../popup/popup.component';
import { Position, SnackbarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    showPassword = false;
    loggedIn = false;

    signForm = new FormGroup({
        email: new FormControl('', Validators.email),
        password: new FormControl(''),
        confirm_password: new FormControl('')
    })

    @ViewChild('loginPopup', { static: true })
    loginPopup!: PopupComponent;

    constructor(
        private supabaseService: SupabaseService,
        private snackbarService: SnackbarService
    ) {

        this.supabaseService.authChangeEvent.subscribe(({ session }) => {
            this.loggedIn = Boolean(session?.user);
        })
    }

    signUpCheckMessage = '';

    signUpCheck() {
        const { email, password, confirm_password } = this.signForm.value;

        if (!email)
            return this.signUpCheckMessage = "Please provide an email"

        // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        //     return this.signUpCheckMessage = "Please provide a valid email"

        if (!password)
            return this.signUpCheckMessage = "A password is required"

        if (password.length < 6)
            return this.signUpCheckMessage = "Password must be at least 6 characters long"

        if (password != confirm_password)
            return this.signUpCheckMessage = "Passwords do not match"

        return this.signUpCheckMessage = ""
    }

    signInCheckMessage = '';

    signInCheck() {
        const { email, password } = this.signForm.value;

        if (!email)
            return this.signInCheckMessage = "Please provide an email"

        // if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        //     return this.signInCheckMessage = "Please provide a valid email"

        if (!password)
            return this.signInCheckMessage = "A password is required"

        return this.signInCheckMessage = ""
    }

    signUpSubmit() {
        if (this.signUpCheck().length) {
            // TODO display snack bar
            // alert(this.signUpCheckMessage)

            this.snackbarError(this.signUpCheckMessage);

            return
        }

        const { email, password } = this.signForm.value
        this.supabaseService.signUp(email!, password!).then(c => {
            console.log(c);

            if (c.error) {
                return this.snackbarError(c.error.message);
            }

            this.snackbarService.init({
                title: "Signed Up!",
                durationMs: 3500,
                position: Position.top,
                success: true
            });

            this.loginPopup.hide();
        })
    }

    signInSubmit() {

        if (this.signInCheck().length) {
            this.snackbarError(this.signInCheckMessage);

            return
        }

        const { email, password } = this.signForm.value
        this.supabaseService.signIn(email!, password!).then(c => {
            console.log(c);

            if (c.error) {
                return this.snackbarError(c.error.message);
            }

            this.snackbarService.init({
                title: "Signed In!",
                durationMs: 3500,
                position: Position.top,
                success: true
            });

            this.loginPopup.hide();

        })
    }


    snackbarError(msg: string) {
        this.snackbarService.init({
            title: msg,
            durationMs: 3500,
            position: Position.top,
            success: false
        });
    }

    signOut() {
        this.supabaseService.signOut();

        this.snackbarService.init({
            title: "Signed Out!",
            durationMs: 3500,
            position: Position.top,
            success: true
        });
    }

}
