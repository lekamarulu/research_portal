# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
import calendar
from collections import defaultdict

from django.db import models
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView


class Default(models.Model):
    id = models.IntegerField(primary_key=True)
    country = models.CharField(max_length=254, blank=True, null=True)
    vote = models.CharField(max_length=254, blank=True, null=True)
    client = models.CharField(max_length=254, blank=True, null=True)
    clientshort = models.CharField(max_length=15, blank=True, null=True)
    header = models.CharField(max_length=254, blank=True, null=True)
    title = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    index = models.CharField(max_length=254, blank=True, null=True)
    address = models.CharField(max_length=254, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    geom = models.TextField(blank=True, null=True)  # This field type is a guess.
    zoom = models.IntegerField(blank=True, null=True)
    center_lat = models.FloatField(blank=True, null=True)
    center_lng = models.FloatField(blank=True, null=True)
    zone_number = models.IntegerField(blank=True, null=True)
    zone_letter = models.CharField(max_length=1, blank=True, null=True)
    logo = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'default'


class Station(models.Model):
    code = models.CharField(primary_key=True, max_length=25)
    name = models.CharField(max_length=100, blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    area = models.FloatField(blank=True, null=True)
    date_established = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=25, blank=True, null=True)
    data_from = models.DateField(blank=True, null=True)
    data_to = models.DateField(blank=True, null=True)
    operation_mode = models.CharField(max_length=25, blank=True, null=True)
    station_type = models.CharField(max_length=25, blank=True, null=True)
    river = models.CharField(max_length=50, blank=True, null=True)
    subbasin_name = models.CharField(max_length=254, blank=True, null=True)
    unit = models.CharField(blank=True, null=True)
    location = models.CharField(max_length=254, blank=True, null=True)
    basin = models.CharField(max_length=254, blank=True, null=True)
    geom = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'station'

    def __str__(self):
        return f"{self.code}"


class ClimateScenario(models.Model):
    climate_scenario = models.CharField(primary_key=True, max_length=20)
    technical_code = models.CharField(max_length=25)
    name = models.CharField(max_length=1000)
    description = models.TextField()

    class Meta:
        managed = False
        db_table = 'climate_scenario'

    def __str__(self):
        return f"{self.technical_code}: {self.name}"


class Rainfall(models.Model):
    id = models.AutoField(primary_key=True)
    # pk = models.CompositePrimaryKey('station_code', 'date_measured', 'climate_scenario')
    station = models.ForeignKey('Station', models.DO_NOTHING, db_column='station_code', to_field='code',
                                verbose_name='Station')
    climate_scenario = models.ForeignKey(ClimateScenario, models.DO_NOTHING, db_column='climate_scenario',
                                         to_field='climate_scenario', verbose_name='Scenario')
    # climate_scenario = models.CharField(max_length=25,verbose_name='Scenario')
    date_measured = models.DateField(verbose_name='Date')
    year_measured = models.IntegerField(blank=True, null=True, verbose_name='Year')
    month_measured = models.IntegerField(blank=True, null=True)
    month_name = models.CharField(max_length=25, blank=True, null=True, verbose_name='Mon')
    month_day = models.IntegerField(blank=True, null=True, verbose_name='Day')
    rainfall_total = models.FloatField(blank=True, null=True, verbose_name='Total')

    class Meta:
        managed = False
        db_table = 'rainfall'
        unique_together = (('climate_scenario','station',  'date_measured'),)

    def save(self, *args, **kwargs):
        if self.date_measured:
            self.year_measured = self.date_measured.year
            self.month_measured = self.date_measured.month
            self.month_name = calendar.month_abbr[self.date_measured.month].upper()  # e.g., 'JAN'
            self.month_day = self.date_measured.day
        super().save(*args, **kwargs)


class Temperature(models.Model):
    # pk = models.CompositePrimaryKey('station_code', 'date_measured', 'climate_scenario')
    id = models.AutoField(primary_key=True)
    station = models.ForeignKey('Station', models.DO_NOTHING, db_column='station_code', to_field='code',
                                verbose_name='Station')
    climate_scenario = models.ForeignKey(ClimateScenario, models.DO_NOTHING, db_column='climate_scenario',
                                         to_field='climate_scenario', verbose_name='Scenario')
    # climate_scenario = models.CharField(max_length=25,verbose_name='Scenario')
    date_measured = models.DateField(verbose_name='Date')
    year_measured = models.IntegerField(blank=True, null=True, verbose_name='Year')
    month_measured = models.IntegerField(blank=True, null=True)
    month_name = models.CharField(max_length=25, blank=True, null=True, verbose_name='Mon')
    month_day = models.IntegerField(blank=True, null=True, verbose_name='Day')
    minimum = models.FloatField(blank=True, null=True, verbose_name='Min')
    maximum = models.FloatField(blank=True, null=True, verbose_name='Max')

    class Meta:
        managed = False
        db_table = 'temperature'
        unique_together = (('climate_scenario','station',  'date_measured'),)

    def save(self, *args, **kwargs):
        if self.date_measured:
            self.year_measured = self.date_measured.year
            self.month_measured = self.date_measured.month
            self.month_name = calendar.month_abbr[self.date_measured.month].upper()  # e.g., 'JAN'
            self.month_day = self.date_measured.day
        super().save(*args, **kwargs)


class Discharge(models.Model):
    id = models.AutoField(primary_key=True)
    station = models.ForeignKey('Station', models.DO_NOTHING, db_column='station_code', to_field='code',
                                verbose_name='Station')
    climate_scenario = models.ForeignKey(ClimateScenario, models.DO_NOTHING, db_column='climate_scenario',
                                         to_field='climate_scenario', verbose_name='Scenario')
    # climate_scenario = models.CharField(max_length=25,verbose_name='Scenario')
    date_measured = models.DateField(verbose_name='Date')
    year_measured = models.IntegerField(blank=True, null=True, verbose_name='Year')
    month_measured = models.IntegerField(blank=True, null=True)
    month_name = models.CharField(max_length=25, blank=True, null=True, verbose_name='Mon')
    month_day = models.IntegerField(blank=True, null=True, verbose_name='Day')
    discharge = models.FloatField(blank=True, null=True, verbose_name='Discharge')
    water_level = models.FloatField(blank=True, null=True, verbose_name='Level')

    class Meta:
        managed = False
        db_table = 'flow'
        unique_together = (('climate_scenario','station',  'date_measured'),)

    def save(self, *args, **kwargs):
        if self.date_measured:
            self.year_measured = self.date_measured.year
            self.month_measured = self.date_measured.month
            self.month_name = calendar.month_abbr[self.date_measured.month].upper()  # e.g., 'JAN'
            self.month_day = self.date_measured.day
        super().save(*args, **kwargs)



class RainfallPivotDaily(models.Model):
    id = models.TextField(primary_key=True)
    climate_scenario = models.CharField(max_length=25, blank=True, null=True)
    station_code = models.CharField(max_length=25, blank=True, null=True)
    year_measured = models.IntegerField(blank=True, null=True)
    month_day = models.IntegerField(blank=True, null=True)
    jan = models.FloatField(blank=True, null=True)
    feb = models.FloatField(blank=True, null=True)
    mar = models.FloatField(blank=True, null=True)
    apr = models.FloatField(blank=True, null=True)
    may = models.FloatField(blank=True, null=True)
    jun = models.FloatField(blank=True, null=True)
    jul = models.FloatField(blank=True, null=True)
    aug = models.FloatField(blank=True, null=True)
    sep = models.FloatField(blank=True, null=True)
    oct = models.FloatField(blank=True, null=True)
    nov = models.FloatField(blank=True, null=True)
    dec = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rainfall_pivot_daily'


class RainfallPivotMonthly(models.Model):
    id = models.TextField(primary_key=True)
    climate_scenario = models.CharField(max_length=25, blank=True, null=True)
    station_code = models.CharField(max_length=25, blank=True, null=True)
    year_measured = models.IntegerField(blank=True, null=True)
    jan = models.FloatField(blank=True, null=True)
    feb = models.FloatField(blank=True, null=True)
    mar = models.FloatField(blank=True, null=True)
    apr = models.FloatField(blank=True, null=True)
    may = models.FloatField(blank=True, null=True)
    jun = models.FloatField(blank=True, null=True)
    jul = models.FloatField(blank=True, null=True)
    aug = models.FloatField(blank=True, null=True)
    sep = models.FloatField(blank=True, null=True)
    oct = models.FloatField(blank=True, null=True)
    nov = models.FloatField(blank=True, null=True)
    dec = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rainfall_pivot_monthly'


class ResearchDataType(models.Model):
    data_type = models.CharField(primary_key=True, max_length=20)

    class Meta:
        managed = False
        db_table = 'research_data_type'



class ResearchDocument(models.Model):
    research_code = models.CharField(primary_key=True, max_length=20)
    research_year = models.IntegerField()
    title = models.CharField(max_length=1000)
    description = models.TextField(blank=True, null=True)
    lead_researcher = models.CharField(max_length=255)
    research_team = models.CharField(max_length=1000, blank=True, null=True)
    submission_to = models.CharField(max_length=255)
    date_started = models.DateField()
    date_finished = models.DateField()
    date_published = models.DateField()
    published_by = models.CharField(max_length=255, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)
    date_updated = models.DateTimeField(blank=True, null=True)
    created_by = models.CharField(max_length=255)
    updated_by = models.CharField(max_length=255, blank=True, null=True)
    document_file = models.BinaryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'research_document'




class ResearchDocumentData(models.Model):
    research_code = models.ForeignKey(ResearchDocument, models.DO_NOTHING, db_column='research_code', blank=True, null=True)
    climate_scenario = models.ForeignKey(ClimateScenario, models.DO_NOTHING, db_column='climate_scenario', blank=True, null=True)
    data_type = models.ForeignKey(ResearchDataType, models.DO_NOTHING, db_column='data_type', blank=True, null=True)
    date_from = models.DateField()
    date_to = models.DateField()

    class Meta:
        managed = False
        db_table = 'research_document_data'

@extend_schema(
    parameters=[
        OpenApiParameter(name='climate_scenario', type=str, location=OpenApiParameter.QUERY, required=False),
        OpenApiParameter(name='station_code', type=str, location=OpenApiParameter.QUERY, required=False),
        OpenApiParameter(name='year_measured', type=int, location=OpenApiParameter.QUERY, required=False),
    ],
    responses={200: None},
    description="Returns pivoted temperature data by month and station."
)
class TemperaturePivotView(APIView):
    def get(self, request, format=None):
        climate_scenario = request.GET.get('climate_scenario')
        station_code = request.GET.get('station_code')
        year_measured = request.GET.get('year_measured')

        qs = Temperature.objects.all()

        if climate_scenario:
            qs = qs.filter(climate_scenario__climate_scenario=climate_scenario)
        if station_code:
            qs = qs.filter(station__code=station_code)
        if year_measured:
            qs = qs.filter(year_measured=year_measured)

        qs = qs.order_by('month_measured')
        pivot_data = defaultdict(lambda: defaultdict(dict))

        for row in qs:
            month = row.month_name or f'Month {row.month_measured}'
            station = row.station.name
            pivot_data[month][station] = {
                'minimum': row.minimum,
                'maximum': row.maximum
            }

        response_data = [{'month_measured': k, 'stations': v} for k, v in pivot_data.items()]
        return Response(response_data)


@extend_schema(
    parameters=[
        OpenApiParameter(name='climate_scenario', type=str, location=OpenApiParameter.QUERY, required=False),
        OpenApiParameter(name='station_code', type=str, location=OpenApiParameter.QUERY, required=False),
        OpenApiParameter(name='year_measured', type=int, location=OpenApiParameter.QUERY, required=False),
    ],
    responses={200: None},
    description="Returns pivoted discharge data by month and station."
)
class DischargePivotView(APIView):
    def get(self, request, format=None):
        climate_scenario = request.GET.get('climate_scenario')
        station_code = request.GET.get('station_code')
        year_measured = request.GET.get('year_measured')

        qs = Discharge.objects.all()

        if climate_scenario:
            qs = qs.filter(climate_scenario__climate_scenario=climate_scenario)
        if station_code:
            qs = qs.filter(station__code=station_code)
        if year_measured:
            qs = qs.filter(year_measured=year_measured)

        qs = qs.order_by('month_measured')
        pivot_data = defaultdict(lambda: defaultdict(dict))

        for row in qs:
            month = row.month_name or f'Month {row.month_measured}'
            station = row.station.name
            pivot_data[month][station] = {
                'discharge': row.discharge,
                'water_level': row.water_level
            }

        response_data = [{'month_measured': k, 'stations': v} for k, v in pivot_data.items()]
        return Response(response_data)