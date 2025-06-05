
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .models import TemperaturePivotView, DischargePivotView
from .views import ClimateScenarioViewSet, StationViewSet, RainfallViewSet, YearsView, \
    TemperatureViewSet, DischargeViewSet, ResearchDocumentViewSet, \
    ResearchDocumentDataViewSet, ResearchDataTypeViewSet, RainfallPivotDailyAPIView, RainfallPivotDailyAPIView

router = DefaultRouter()
router.register(r'scenario', ClimateScenarioViewSet)
router.register(r'station', StationViewSet)
router.register(r'rainfall', RainfallViewSet)
router.register(r'temperature', TemperatureViewSet)
router.register(r'discharge', DischargeViewSet)
router.register(r'research-document', ResearchDocumentViewSet)
router.register(r'research-document-data', ResearchDocumentDataViewSet)
router.register(r'research-data-type', ResearchDataTypeViewSet)

urlpatterns = [
    path('years/', YearsView.as_view(), name='years'),
    path('rainfall-pivot-daily', RainfallPivotDailyAPIView.as_view(), name='rainfall-pivot-daily'),
    path('rainfall-pivot-monthly', RainfallPivotDailyAPIView.as_view(), name='rainfall-pivot-monthly'),

    path('temperature-pivot', TemperaturePivotView.as_view(), name='temperature-pivot'),
    path('api/pivot/discharge/', DischargePivotView.as_view(), name='discharge-pivot'),
    path('', include(router.urls)),
]
