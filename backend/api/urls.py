# from django.urls import path
# from .views import RainfallPivotView, ExportRainfallExcelView, ExportRainfallPDFView
#
# urlpatterns = [
#     path('pivot/', RainfallPivotView.as_view()),
#     path('export/excel/', ExportRainfallExcelView.as_view()),
#     path('export/pdf/', ExportRainfallPDFView.as_view()),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ClimateScenarioViewSet, RainfallStationMonthlyPivot, StationViewSet, RainfallViewSet, YearsView, RainfallMonthlyPivotView

router = DefaultRouter()
router.register(r'climate_scenarios', ClimateScenarioViewSet)
router.register(r'stations', StationViewSet)
router.register(r'rainfall', RainfallViewSet)

urlpatterns = [
    # path('rainfall-pivot/', RainfallPivotView.as_view(), name='rainfall-pivot'),
    # path('rainfall-monthly-pivot/', RainfallMonthlyPivotView.as_view(), name='rainfall-monthly-pivot'),
    path('rainfall-monthly-pivot/', RainfallStationMonthlyPivot.as_view(), name='rainfall-monthly-pivot'),
    path('years/', YearsView.as_view(), name='years'),

    path('', include(router.urls)),
]
