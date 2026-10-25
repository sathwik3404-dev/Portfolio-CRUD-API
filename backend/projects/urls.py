from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView, PublicProjectListView

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project-list-create'),
    path('public/', PublicProjectListView.as_view(), name='project-public-list'),
    path('<int:id>/', ProjectDetailView.as_view(), name='project-detail'),
]
