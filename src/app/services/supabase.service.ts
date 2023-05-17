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
import { Position, SnackbarService } from './snackbar.service';
import { FilesService } from './files.service';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient
    authChangeEvent = new EventEmitter<{ event: AuthChangeEvent, session: AuthSession | null }>()

    get session(): Promise<AuthSession | null> {
        return new Promise((resolve, reject) => {
            this.supabase.auth.getSession().then(({ data }) => {
                resolve(data.session)
            })
        });
    }

    constructor(
        private snackbarService: SnackbarService,
        private filesService: FilesService
    ) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.authChangeEvent.emit({ event, session });
        })
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

    async uploadFiles(...files: File[]) {
        const session = await this.session;

        if (!session) {
            return this.snackbarService.init({
                title: "You must be signed in to upload files",
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        const checkFiles = this.filesService.checkFiles(...files);

        if (checkFiles?.length) {
            return this.snackbarService.init({
                title: checkFiles,
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        let file = files.length > 1 ? await this.filesService.zipFiles(...files) : files[0];

        const { data: fileData, error: fileInsertError } = await this.supabase
            .from('files')
            .insert({
                owner_id: session.user.id,
            }).select('id, name');

        console.log(fileData);


        if (fileInsertError) {
            return this.snackbarService.init({
                title: fileInsertError.message,
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        const { data, error } = await this.supabase
            .storage
            .from('files')
            .upload(fileData[0].id, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            return this.snackbarService.init({
                title: error.message,
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        return this.snackbarService.init({
            title: "File(s) have been uploaded!",
            position: Position.top,
            success: true,
            durationMs: 3500
        })
    }

    async fetchFiles() {
        const session = await this.session;

        const { data, error } = await this.supabase
            .from('files')
            .select('*');

        this.supabase.storage.from('files')
            .createSignedUrl("023a07c7-458c-4591-b6ea-6e32d236e8ac", 60)
            .then((e) => {
                console.log(e.data?.signedUrl);
                console.log(e);


            })
        return data
    }
}