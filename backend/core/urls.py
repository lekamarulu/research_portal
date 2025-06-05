from django.urls import path
# from . import views
from .views import *

from django.shortcuts import redirect

urlpatterns = [
    path('', lambda request: redirect('station_list')),  # Redirect to HTML page
    path('station/', StationListView.as_view(), name='station_list'),  # HTML page view
    path('station/api/', StationListJsonView.as_view(), name='station_list_api'),  # JSON API
    path('station/create/', StationCreateView.as_view(), name='station_create'),
    path('station/<str:pk>/update/', StationUpdateView.as_view(), name='station_update'),
    path('station/<str:pk>/delete/', StationDeleteView.as_view(), name='station_delete'),
]
