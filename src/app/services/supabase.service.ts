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
import * as JSZip from 'jszip';
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

    async zipFiles(...files: File[]) {
        const zip = new JSZip();

        let folder = zip.folder("files");

        files.forEach(file => {
            folder?.file(file.name, file);
        });

        const content = await zip.generateAsync({ type: "blob" });
        return new File([content], "files.zip", { type: "application/zip" })
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

        let file = files.length > 1 ? await this.zipFiles(...files) : files[0];

        // ToDo: Create upload element in database and link it to the user


        // ToDo: Use upload element id from databse for the folder's name
        const { data, error } = await this.supabase
            .storage
            .from('files')
            .upload(`${session.user.id}-${Date.now()}`, file, {
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
        const { data, error } = await this.supabase
            .storage
            .from('files')
            .list();


        console.log(data);
        console.error(error);


    }


}