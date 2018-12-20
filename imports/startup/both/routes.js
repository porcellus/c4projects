import { FlowRouter } from "meteor/kadira:flow-router";
import { BlazeLayout } from "meteor/kadira:blaze-layout";
import { Session } from "meteor/session";
import { Accounts } from "meteor/accounts-base";

import { notify } from "../../ui/utils/notifier";

const userLoginFilter = (context, redirect, _stop) => {
  let oldRoute = "/";
  let authRoutes = ["/login", "/signup"];

  if (context.oldRoute !== undefined) {
    oldRoute = context.oldRoute.path;
  }

  // restrict access to auth pages when user is signed in
  if (Meteor.userId() && authRoutes.some(a => context.path.startsWith(a))) {
    redirect(oldRoute);
  }

  if (!Meteor.userId() && !authRoutes.some(a => context.path.startsWith(a))) {
    if (notify) notify("Login to continue!", "error");
    redirect("/login?from=" + context.path);
  }
};

// Redirect to login
Accounts.onLogout(user => {
  FlowRouter.go("/login");
});

// FlowRouter.triggers.enter([userLoginFilter], { except: ['home', 'projects'] })
FlowRouter.triggers.enter([
  function(options) {
    if (options.route.options && options.route.options.breadcrumb) {
      let breadcrumb = options.route.options.breadcrumb(options.params) || {};
      breadcrumb.urls = breadcrumb.urls || [];
      Session.set("breadcrumbs", breadcrumb);
    } else {
      Session.set("breadcrumbs", {});
    }
  },
]);

// Set up all routes in the app
FlowRouter.route("/", {
  name: "home",
  breadcrumb: params => {
    return {
      text: "",
      urls: ["/"],
    };
  },
  subscriptions: function(params, queryParams) {},
  action: () => {
    BlazeLayout.render("main", {
      header: "header",
      sidebar: "sidebar",
      footer: "footer",
      main: "home",
    });
  },
});

// Set up all routes in the app
FlowRouter.route("/login", {
  name: "login",
  breadcrumb: params => {
    return {
      text: "",
      urls: ["/"],
    };
  },
  triggersEnter: [userLoginFilter],
  subscriptions: function(params, queryParams) {},
  action: () => {
    BlazeLayout.render("main", {
      header: "header",
      sidebar: "sidebar",
      main: "login",
    });
  },
});

// Set up all routes in the app
FlowRouter.route("/signup", {
  name: "signup",
  breadcrumb: params => {
    return {
      text: "",
      urls: ["/"],
    };
  },
  triggersEnter: [userLoginFilter],
  subscriptions: function(params, queryParams) {},
  action: () => {
    BlazeLayout.render("main", {
      header: "header",
      sidebar: "sidebar",
      footer: "footer",
      main: "signup",
    });
  },
});
