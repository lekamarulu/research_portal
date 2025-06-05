from django import forms
from api.models import Rainfall, Temperature, Discharge,Station

class RainfallForm(forms.ModelForm):
    class Meta:
        model = Rainfall
        fields = '__all__'

class TemperatureForm(forms.ModelForm):
    class Meta:
        model = Temperature
        fields = '__all__'

class DischargeForm(forms.ModelForm):
    class Meta:
        model = Discharge
        fields = '__all__'

class StationForm(forms.ModelForm):
    class Meta:
        model = Station
        fields = '__all__'
