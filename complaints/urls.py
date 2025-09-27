from django.urls import path
from .views import (
    ComplaintCreateView, MyComplaintsView,
    ComplaintListView, ComplaintUpdateView,
    ComplaintStatsView
)

urlpatterns = [
    path("create/", ComplaintCreateView.as_view(), name="create_complaint"),
    path("my/", MyComplaintsView.as_view(), name="my_complaints"),
    path("all/", ComplaintListView.as_view(), name="all_complaints"),  # officers/admins
    path("<int:pk>/update/", ComplaintUpdateView.as_view(), name="update_complaint"),  # officers/admins
    path("stats/", ComplaintStatsView.as_view(), name="complaint_stats"),  # dashboard
]

