from rest_framework import serializers
from .models import ClimateScenario, Rainfall, Station, Temperature, Discharge, ResearchDataType, ResearchDocument, \
    ResearchDocumentData, RainfallPivotDaily, RainfallPivotMonthly


class DischargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discharge
        fields = '__all__'


class RainfallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rainfall
        fields = '__all__'


class TemperatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temperature
        fields = '__all__'


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'


class ClimateScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClimateScenario
        fields = '__all__'


class RainfallPivotSerializer(serializers.Serializer):
    month_name = serializers.CharField(max_length=25)
    stations = serializers.DictField(child=serializers.FloatField(allow_null=True))


class RainfallPivotDailySerializer(serializers.ModelSerializer):
    class Meta:
        model = RainfallPivotDaily
        fields = '__all__'


class RainfallPivotMonthlySerializer(serializers.ModelSerializer):
    class Meta:
        model = RainfallPivotMonthly
        fields = '__all__'

# class RainfallMonthlyPivotSerializer(serializers.Serializer):
#     climate_scenario = serializers.CharField()
#     year_measured = serializers.IntegerField()
#     station_code = serializers.CharField()
#
#     jan = serializers.FloatField(allow_null=True)
#     feb = serializers.FloatField(allow_null=True)
#     mar = serializers.FloatField(allow_null=True)
#     apr = serializers.FloatField(allow_null=True)
#     may = serializers.FloatField(allow_null=True)
#     jun = serializers.FloatField(allow_null=True)
#     jul = serializers.FloatField(allow_null=True)
#     aug = serializers.FloatField(allow_null=True)
#     sep = serializers.FloatField(allow_null=True)
#     oct = serializers.FloatField(allow_null=True)
#     nov = serializers.FloatField(allow_null=True)
#     dec = serializers.FloatField(allow_null=True)
#
#
# class RainfallDailyPivotSerializer(serializers.Serializer):
#     climate_scenario = serializers.CharField()
#     year_measured = serializers.IntegerField()
#     station_code = serializers.CharField()
#     month_day = serializers.IntegerField()
#     jan = serializers.FloatField(allow_null=True)
#     feb = serializers.FloatField(allow_null=True)
#     mar = serializers.FloatField(allow_null=True)
#     apr = serializers.FloatField(allow_null=True)
#     may = serializers.FloatField(allow_null=True)
#     jun = serializers.FloatField(allow_null=True)
#     jul = serializers.FloatField(allow_null=True)
#     aug = serializers.FloatField(allow_null=True)
#     sep = serializers.FloatField(allow_null=True)
#     oct = serializers.FloatField(allow_null=True)
#     nov = serializers.FloatField(allow_null=True)
#     dec = serializers.FloatField(allow_null=True)
#

#
# class RainfallPivotDailySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RainfallPivotDaily
#         fields = '__all__'
#
# class RainfallPivotMonthlySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RainfallPivotMonthly
#         fields = '__all__'


class ResearchDataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchDataType
        fields = '__all__'


class ResearchDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchDocument
        fields = '__all__'


class ResearchDocumentDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchDocumentData
        fields = '__all__'
