"use strict";
var App = {
    initAdminLTE: function() {
        $('body').Layout();
        $('[data-toggle="push-menu"]').PushMenu();
        $('[data-widget="treeview"]').Treeview('init');
        //$('[data-widget="treeview"]').Treeview();
    }
}