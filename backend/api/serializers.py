from rest_framework import serializers
from .models import Rainfall,Station

class RainfallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rainfall
        fields = '__all__'

class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'

#
class RainfallPivotSerializer(serializers.Serializer):
    month_name = serializers.CharField(max_length=25)
    stations = serializers.DictField(child=serializers.FloatField(allow_null=True))

class StationMonthlyPivotSerializer(serializers.Serializer):
    station_code = serializers.CharField()
    months = serializers.DictField(child=serializers.FloatField(allow_null=True))

    def to_representation(self, instance):
        result = {
            'station_code': instance.get('station_code'),
            'months': {
                month: (
                    float(f"{instance.get(month, 0.0):.2f}")
                    if instance.get(month) is not None else None
                )
                for month in [
                    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
                ]
            }
        }
        return result