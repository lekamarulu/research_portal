from django_filters import rest_framework as filters
from .models import Rainfall, Station

class RainfallFilter(filters.FilterSet):
    station_code = filters.ModelChoiceFilter(queryset=Station.objects.all())
    year_measured = filters.NumberFilter(field_name='year_measured')
    climate_scenario = filters.CharFilter(field_name='climate_scenario')

    class Meta:
        model = Rainfall
        fields = ['station_code', 'year_measured', 'climate_scenario']
