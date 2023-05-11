import { EventEmitter, Injectable } from '@angular/core';
import {
    AuthChangeEvent,
    AuthSession,
    createClient,
    Session,
    SupabaseClient,
    User,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient
    authChangeEvent = new EventEmitter<{ event: AuthChangeEvent, session: AuthSession | null }>()

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.authChangeEvent.emit({ event, session });
        })
    }

    get session(): Promise<AuthSession | null> {
        return new Promise((resolve, reject) => {
            this.supabase.auth.getSession().then(({ data }) => {
                resolve(data.session)
            })
        });
    }

    signIn(email: string, password: string) {
        return this.supabase.auth.signInWithPassword({ email, password })
    }

    signUp(email: string, password: string) {
        return this.supabase.auth.signUp({ email, password })
    }

    signOut() {
        return this.supabase.auth.signOut()
    }


}