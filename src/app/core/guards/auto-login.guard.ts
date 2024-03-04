import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
	constructor(
        private auth: AuthService,
        private router: Router
    ) {}

	canLoad(): Observable<boolean> {
		return this.auth.isAuthenticated.pipe(
			filter((val) => val !== null),
			take(1),
			map((isAuthenticated) => {
				if (isAuthenticated) {
					this.router.navigateByUrl('/home', { replaceUrl: true });
				} else {
					return true;
				}
			})
		);
	}
}
