from django_filters import rest_framework as filters
from .models import Rainfall, Station, Discharge, Temperature, ResearchDocumentData, ResearchDocument


class DischargeFilter(filters.FilterSet):
    station_code = filters.ModelChoiceFilter(queryset=Station.objects.all())
    year_measured = filters.NumberFilter(field_name='year_measured')
    climate_scenario = filters.CharFilter(field_name='climate_scenario')

    class Meta:
        model = Discharge
        fields = ['station_code', 'year_measured', 'climate_scenario']

class RainfallFilter(filters.FilterSet):
    station_code = filters.ModelChoiceFilter(queryset=Station.objects.all())
    year_measured = filters.NumberFilter(field_name='year_measured')
    climate_scenario = filters.CharFilter(field_name='climate_scenario')

    class Meta:
        model = Rainfall
        fields = ['station_code', 'year_measured', 'climate_scenario']

class TemperatureFilter(filters.FilterSet):
    station_code = filters.ModelChoiceFilter(queryset=Station.objects.all())
    year_measured = filters.NumberFilter(field_name='year_measured')
    climate_scenario = filters.CharFilter(field_name='climate_scenario')

    class Meta:
        model = Temperature
        fields = ['station_code', 'year_measured', 'climate_scenario']


class ResearchDocumentFilter(filters.FilterSet):
    class Meta:
        model = ResearchDocument
        fields = {
            'research_year': ['exact'],
            'lead_researcher': ['icontains'],
            'submission_to': ['icontains'],
            'date_started': ['gte', 'lte'],
        }


class ResearchDocumentDataFilter(filters.FilterSet):
    class Meta:
        model = ResearchDocumentData
        fields = {
            'climate_scenario': ['exact'],
            'data_type': ['exact'],
            'date_from': ['gte', 'lte'],
            'date_to': ['gte', 'lte'],
        }


class RainfallPivotFilter(filters.FilterSet):
    climate_scenario = filters.CharFilter(lookup_expr='iexact')
    year_measured = filters.NumberFilter()
    station_code = filters.CharFilter(lookup_expr='iexact')

    class Meta:
        fields = ['climate_scenario', 'year_measured', 'station_code']
