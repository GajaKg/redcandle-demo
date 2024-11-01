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

  protected currentRoute: any = signal('');

  ngOnInit() {
    this.router.events.forEach((event) => {
      if(event instanceof RoutesRecognized) {
        const path = event.state.root.pathFromRoot[0].children[0]?.url[0].path || "home";
        this.currentRoute.set(path)
      }
    });
    this.currentRoute.set(this.route.snapshot.url);
  }

  navigateTo(routeName: string) {
    // this.router.navigate([routeName])
    this.router.navigateByUrl(routeName)
  }
}
