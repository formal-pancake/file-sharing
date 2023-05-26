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

        // check if the user is signed in
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

        let description = "";

        files.map(file => {
            description += `- ${file.name}\n`
        })

        let file = files.length > 1 ? await this.filesService.zipFiles(...files) : files[0];

        // insert new row in the 'files' table
        const { data: fileDbData, error: fileInsertError } = await this.supabase
            .from('files')
            .insert({
                owner_id: session.user.id,
                name: file.name,
                description: description
            })
            .select('id, name');


        if (fileInsertError) {
            return this.snackbarService.init({
                title: fileInsertError.message,
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        // upload file in the 'files' bucket
        const { data: fileUploadData, error: fileUploadError } = await this.supabase
            .storage
            .from('files')
            .upload(`${session.user.id}/${fileDbData[0].id}`, file);

        if (fileUploadError) {
            return this.snackbarService.init({
                title: fileUploadError.message,
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        this.filesService.clearFiles();

        return this.snackbarService.init({
            title: "File(s) have been uploaded!",
            position: Position.top,
            success: true,
            durationMs: 3500
        })
    }

    async fetchFiles() {
        // ToDo: probably make a property 'loggedIn' instead of this
        const session = await this.session;

        // check if the user is signed in
        if (!session) {
            return this.snackbarService.init({
                title: "You must be signed in to upload files",
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        const { data, error } = await this.supabase
            .from('files')
            .select('*');

        if (error) {
            return this.snackbarService.init({
                title: error.message,
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        return data
    }

    async generateUploadUrl(id: string, expiresInSeconds: number) {
        // ToDo: probably make a property 'loggedIn' instead of this
        const session = await this.session;

        // check if the user is signed in
        if (!session) {
            return this.snackbarService.init({
                title: "You must be signed in to upload files",
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        return await this.supabase
            .storage
            .from('files')
            .createSignedUrl(`${session.user.id}/${id}`, expiresInSeconds)
    }

    async downloadFile(id: string) {
        const session = await this.session;

        // check if the user is signed in
        if (!session) {
            this.snackbarService.init({
                title: "You must be signed in to upload files",
                position: Position.top,
                success: false,
                durationMs: 3500
            })

            return { data: null, error: new Error() }
        }

        return this.supabase
            .storage
            .from('files')
            .download(`${session.user.id}/${id}`) as Promise<{
                data: Blob;
                error: null;
            }>
    }

    async deleteFile(fileId: string) {

        // ToDo: probably make a property 'loggedIn' instead of this
        const session = await this.session;

        // check if the user is signed in
        if (!session) {
            return this.snackbarService.init({
                title: "You must be signed in to upload files",
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        // delete row
        await this.supabase
            .from('files')
            .delete()
            .eq('id', fileId);

        // delete from bucket
        const { data, error } = await this.supabase
            .storage
            .from('files')
            .remove([`${session.user.id}/${fileId}`])

        if (error) {
            return this.snackbarService.init({
                title: error.message,
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }


        return this.snackbarService.init({
            title: "File deleted",
            position: Position.top,
            success: true,
            durationMs: 3500
        })

    }


    async editFileName(fileId: string, newName: string) {
        const session = await this.session;

        // check if the user is signed in
        if (!session) {
            this.snackbarService.init({
                title: "You must be signed in to to this",
                position: Position.top,
                success: false,
                durationMs: 3500
            })

            return
        }

        const { data, error } = await this.supabase
            .from('files')
            .update({ name: newName })
            .eq("id", fileId);

        if (error) {
            return this.snackbarService.init({
                title: error.message,
                position: Position.top,
                success: false,
                durationMs: 3500
            })
        }

        return this.snackbarService.init({
            title: "Renamed file",
            position: Position.top,
            success: true,
            durationMs: 3500
        })


    }

}