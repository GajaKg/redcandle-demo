import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Params, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // protected currentRoute: Signal<string> = signal('');
  protected currentRoute: any = signal('');

  ngOnInit() {
    console.log(this.route)
    // console.log(this.route.snapshot)
    // console.log(this.router)
    this.router.events.forEach((event) => {
      // if(event instanceof NavigationEnd) {
      //   console.log(event)
      // }
      // if(event instanceof NavigationStart) {
      //   console.log(event)
      // }
      if(event instanceof RoutesRecognized) {
        console.log(event)
        console.log(event.state.root.pathFromRoot[0].children[0]?.url[0].path)
        const path = event.state.root.pathFromRoot[0].children[0]?.url[0].path || "home";
        this.currentRoute.set(path)
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });


    this.currentRoute.set(this.route.snapshot.url);
  }

  navigateTo(routeName: string) {
    // this.router.navigate([routeName])
    this.router.navigateByUrl(routeName)
  }
}
