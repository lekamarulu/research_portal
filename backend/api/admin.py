from django.contrib import admin

# Register your models here.
from .models import Station,ClimateScenario,Rainfall,Temperature,Discharge
list_to_exclude = ['year_measured','month_measured','month_name','month_day']

@admin.register(Rainfall)
class RainfallAdmin(admin.ModelAdmin):
    exclude = list_to_exclude

@admin.register(Temperature)
class TemperatureAdmin(admin.ModelAdmin):
    exclude = list_to_exclude

# @admin.register(Discharge)
# class DischargeAdmin(admin.ModelAdmin):
#     exclude = list_to_exclude

# admin.site.register(Station)
@admin.register(Station)
class StationAdmin(admin.ModelAdmin):
    fields = ['code','name', 'longitude', 'latitude', 'status']  # Only these fields will appear in the form


admin.site.register(ClimateScenario)
