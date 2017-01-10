
# ngRoute instead of ui-router

ui-router is the standard router used w/ Ionic, but ngRoute is what I had
working since before. In the spirit of not introducing more than one unknown
at a time, ui-router was skipped. Every time I have tried to migrate have
just been wasted time so far, mostly because of problems introduced by
the view caching mechanism in Ionic.

# not using an AngularJS template to render account activity items

Collection-repeat doesn't get the separating "border-bottom"-line right,
and I'm not getting scrolling with collection-repeat to work on mobile.
It works on desktop, but it's still too slow. Ng-repeat with infinite scrolling
turned out to be slower than just rendering the damned thing on my own,
so that's what got selected.
