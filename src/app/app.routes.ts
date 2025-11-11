import { Routes } from "@angular/router";
import { EventListComponent } from "../components/event-list.component";
import { CalendarViewComponent } from "../components/calendar-view.component";
import { CompactViewComponent } from "../components/compact-view.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./guards/auth.guard";
import { ProfileComponent } from "./profile/profile.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { UpdatePasswordComponent } from "./auth/update-password/update-password.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/compact", pathMatch: "full" },
      { path: "list", component: EventListComponent },
      { path: "calendar", component: CalendarViewComponent },
      { path: "compact", component: CompactViewComponent },
      { path: "profile", component: ProfileComponent },
      { path: "update-password", component: UpdatePasswordComponent },
    ],
  },
  { path: "**", redirectTo: "login" },
];
