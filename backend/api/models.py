# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


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


class Rainfall(models.Model):
    id = models.AutoField(primary_key=True)
    # pk = models.CompositePrimaryKey('station_code', 'date_measured', 'climate_scenario')
    date_measured = models.DateField(verbose_name='Date')
    station = models.ForeignKey('Station', models.DO_NOTHING, db_column='station_code', to_field='code',verbose_name='Station')
    climate_scenario = models.CharField(max_length=25,verbose_name='Scneario')
    year_measured = models.IntegerField(blank=True, null=True,verbose_name='Year')
    month_measured = models.IntegerField(blank=True, null=True)
    month_name = models.CharField(max_length=25,blank=True, null=True,verbose_name='Mon')
    month_day = models.IntegerField(blank=True, null=True,verbose_name='Day')
    rainfall_total = models.FloatField(blank=True, null=True,verbose_name='Total')
    rainfall_max = models.FloatField(blank=True, null=True,verbose_name='Max')

    class Meta:
        managed = False
        db_table = 'rainfall'
        unique_together = (('station', 'date_measured', 'climate_scenario'),)
