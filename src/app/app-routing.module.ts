import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './components/setup/setup.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'setup',
        component: SetupComponent
    },
    {
       path: 'game',
       component: GameComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
