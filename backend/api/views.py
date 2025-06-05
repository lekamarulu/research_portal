from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
)
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import RainfallFilter, DischargeFilter, TemperatureFilter, ResearchDocumentFilter, \
    ResearchDocumentDataFilter
from .models import ClimateScenario, Rainfall, Station, Temperature, Discharge, ResearchDocument, ResearchDataType, \
    ResearchDocumentData, RainfallPivotDaily, RainfallPivotMonthly
from .serializers import ClimateScenarioSerializer, RainfallSerializer, StationSerializer, \
    DischargeSerializer, TemperatureSerializer, ResearchDocumentSerializer, ResearchDataTypeSerializer, \
    ResearchDocumentDataSerializer, RainfallPivotDailySerializer, RainfallPivotMonthlySerializer


# @extend_schema(tags=['ResearchDocument'])
class ResearchDocumentViewSet(viewsets.ModelViewSet):
    queryset = ResearchDocument.objects.all()
    serializer_class = ResearchDocumentSerializer
    # filter_backends = [DjangoFilterBackend]
    filterset_class = ResearchDocumentFilter


# @extend_schema(tags=['ResearchDocumentData'])
class ResearchDocumentDataViewSet(viewsets.ModelViewSet):
    queryset = ResearchDocumentData.objects.all()
    serializer_class = ResearchDocumentDataSerializer
    # filter_backends = [DjangoFilterBackend]
    filterset_class = ResearchDocumentDataFilter


# @extend_schema(tags=['ResearchDataType'])
class ResearchDataTypeViewSet(viewsets.ModelViewSet):
    queryset = ResearchDataType.objects.all()
    serializer_class = ResearchDataTypeSerializer


class YearsView(APIView):

    def get(self, request, *args, **kwargs):
        years = (
            Rainfall.objects.values_list('year_measured', flat=True)
            .distinct()
            .order_by('year_measured')
        )
        data = [{'year': y} for y in years]
        return Response(data)


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer


class ClimateScenarioViewSet(viewsets.ModelViewSet):
    queryset = ClimateScenario.objects.all()
    serializer_class = ClimateScenarioSerializer


@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name="station_code",
                description="Filter by Station",
                required=False,
                type=str,
                examples=[
                    OpenApiExample("Station A", value="ST001"),
                    OpenApiExample("Station B", value="ST002"),
                ]
            ),
            OpenApiParameter(
                name="year_measured",
                description="Filter by Year",
                required=False,
                type=int,
                examples=[
                    OpenApiExample("Year 2022", value=2022),
                    OpenApiExample("Year 2023", value=2023),
                ]
            ),
            OpenApiParameter(
                name="climate_scenario",
                description="Filter by Scenario",
                required=True,
                type=str,
                examples=[
                    OpenApiExample("Scenario RCP4.5", value="RCP45"),
                    OpenApiExample("Scenario RCP8.5", value="RCP85"),
                ]
            ),
        ]
    )
)
class DischargeViewSet(viewsets.ModelViewSet):
    queryset = Discharge.objects.all()
    serializer_class = DischargeSerializer
    filterset_class = DischargeFilter
    pagination_class = None


class RainfallViewSet(viewsets.ModelViewSet):
    queryset = Rainfall.objects.all()
    serializer_class = RainfallSerializer
    filterset_class = RainfallFilter
    pagination_class = None

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='station_code',
                description='Filter by station code',
                required=False,
                type=str,
                enum=[station.code for station in Station.objects.all()],  # assuming `code` is unique
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name='year_measured',
                description='Year the rainfall was measured',
                required=False,
                type=int,
                enum=[year for year in range(1970, 2101)],
                location=OpenApiParameter.QUERY,
            ),
            OpenApiParameter(
                name='climate_scenario',
                description='Climate scenario (e.g., RCP4.5, RCP8.5)',
                required=False,
                type=str,
                enum=[scenario.climate_scenario for scenario in ClimateScenario.objects.all()],
                # assuming `code` is unique
                location=OpenApiParameter.QUERY,
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class TemperatureViewSet(viewsets.ModelViewSet):
    queryset = Temperature.objects.all()
    serializer_class = TemperatureSerializer
    filterset_class = TemperatureFilter
    pagination_class = None


# class StandardResultsSetPagination(PageNumberPagination):
# page_size = 50
# page_size_query_param = 'page_size'
# max_page_size = 200
#
#
# @extend_schema(
#     summary="Get daily rainfall pivot data",
#     description="Filter by climate_scenario, year_measured, and station_code",
#     tags=["RainfallPivotDaily"],
#     parameters=[
#         OpenApiParameter("climate_scenario", str, OpenApiParameter.QUERY, description="Climate scenario"),
#         OpenApiParameter("year_measured", int, OpenApiParameter.QUERY, description="Year"),
#         OpenApiParameter("station_code", str, OpenApiParameter.QUERY, description="Station code"),
#         OpenApiParameter("page", int, OpenApiParameter.QUERY, description="Page number"),
#         OpenApiParameter("page_size", int, OpenApiParameter.QUERY, description="Items per page"),
#     ]
# )
#
# class RainfallPivotDailyAPIView(generics.ListAPIView):
#     queryset = RainfallPivotDaily.objects.all()
#     serializer_class = RainfallPivotDailySerializer
#     # pagination_class = StandardResultsSetPagination
#     filter_backends = [DjangoFilterBackend]
#     filterset_class = RainfallPivotFilter
#
#
# @extend_schema(
#     summary="Get monthly rainfall pivot data",
#     description="Filter by climate_scenario, year_measured, and station_code",
#     tags=["RainfallPivotMonthly"],
#     parameters=[
#         OpenApiParameter("climate_scenario", str, OpenApiParameter.QUERY, description="Climate scenario"),
#         OpenApiParameter("year_measured", int, OpenApiParameter.QUERY, description="Year"),
#         OpenApiParameter("station_code", str, OpenApiParameter.QUERY, description="Station code"),
#         OpenApiParameter("page", int, OpenApiParameter.QUERY, description="Page number"),
#         OpenApiParameter("page_size", int, OpenApiParameter.QUERY, description="Items per page"),
#     ]
# )
#
# class RainfallPivotMonthlyAPIView(generics.ListAPIView):
#     queryset = RainfallPivotMonthly.objects.all()
#     serializer_class = RainfallPivotMonthlySerializer
#     # pagination_class = StandardResultsSetPagination
#     filter_backends = [DjangoFilterBackend]
#     filterset_class = RainfallPivotFilter
#


# class RainfallStationMonthlyPivot(APIView):
#
#     @extend_schema(
#         description="Get a pivot table with stations as rows and months as columns.",
#         responses={200: StationMonthlyPivotSerializer(many=True)},
#         parameters=[
#             OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
#             OpenApiParameter(name='year_measured', description='Year measured filter', required=True, type=int),
#             OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False,
#                              type=str)
#         ]
#     )
#     def get(self, request, *args, **kwargs):
#         climate_scenario = request.query_params.get('scenario')
#         year_measured = request.query_params.get('year')
#         station_code = request.query_params.get('station')
#
#         # Step 1: Manually define logical month order
#         logical_months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
#                           'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
#
#         with connection.cursor() as cursor:
#             cursor.execute("""
#                 SELECT DISTINCT month_name
#                 FROM rainfall
#                 WHERE climate_scenario = %s AND year_measured = %s
#                 AND (%s IS NULL OR station_code = %s)
#             """, [climate_scenario, year_measured, station_code, station_code])
#             available_months = {row[0] for row in cursor.fetchall()}
#
#         # Step 3: Final ordered list of months based on logical order
#         month_names = [m for m in logical_months if m in available_months]
#
#         if not month_names:
#             return Response({"detail": "No data available for the specified filters."},
#                             status=status.HTTP_200_OK)
#
#         # Step 4: Build dynamic SQL for crosstab
#         column_list = ", ".join([f'"{month}" float' for month in month_names])
#         crosstab_columns = ", ".join([f'"{month}"' for month in month_names])
#
#         crosstab_query = f"""
#             SELECT station_code, {crosstab_columns}
#             FROM crosstab(
#                 $$
#                 SELECT station_code, month_name, rainfall_total
#                 FROM rainfall
#                 WHERE climate_scenario = %s AND year_measured = %s
#                 AND (%s IS NULL OR station_code = %s)
#                 ORDER BY station_code,
#                          CASE month_name
#                              {' '.join([f"WHEN '{m}' THEN {i + 1}" for i, m in enumerate(logical_months)])}
#                              ELSE 999
#                          END
#                 $$,
#                 $$
#                 SELECT unnest(ARRAY[{', '.join([f"'{m}'" for m in month_names])}])
#                 $$
#             ) AS pivot_table (
#                 station_code character varying(25),
#                 {column_list}
#             );
#         """
#
#         # Step 5: Execute the pivot query
#         with connection.cursor() as cursor:
#             cursor.execute(crosstab_query, [
#                 climate_scenario, year_measured, station_code, station_code
#             ])
#             rows = cursor.fetchall()
#
#         if not rows:
#             return Response({"detail": "No data found for the specified filters."},
#                             status=status.HTTP_404_NOT_FOUND)
#
#         # Step 6: Structure results
#         data = []
#         for row in rows:
#             station = row[0]
#             values = {
#                 month: f"{row[i + 1]:.2f}" if row[i + 1] is not None else None
#                 for i, month in enumerate(month_names)
#             }
#             data.append({
#                 'station_code': station,
#                 'months': values
#             })
#
#         return Response(data, status=status.HTTP_200_OK)
#
#
# class RainfallMonthlyPivot1(APIView):
#
#     @extend_schema(
#         description="Get a pivot table with stations as rows and months as columns.",
#         responses={200: RainfallMonthlyPivotSerializer(many=True)},
#         parameters=[
#             OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
#             OpenApiParameter(name='year_measured', description='Year measured filter', required=False, type=int),
#             OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False,
#                              type=str)
#         ]
#     )
#     def get(self, request, *args, **kwargs):
#         climate_scenario = request.query_params.get('scenario')
#         year_measured = request.query_params.get('year')
#         station_code = request.query_params.get('station')
#
#         print(climate_scenario, year_measured, station_code)
#
#         data = []
#         with connection.cursor() as cursor:
#             if station_code and climate_scenario and year_measured:
#                 cursor.execute("""
#                     SELECT month_day AS rowheader, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec
#                     FROM public.rainfall_pivot_daily
#                     WHERE climate_scenario = %s AND year_measured = %s
#                       AND (%s IS NULL OR station_code = %s)
#                 """, [climate_scenario, year_measured, station_code, station_code])
#                 rows = cursor.fetchall()
#                 columns = [col[0] for col in cursor.description]
#
#             elif climate_scenario and year_measured and (station_code is None or station_code == ''):
#                 cursor.execute("""
#                     SELECT station_code AS rowheader, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec
#                     FROM public.rainfall_pivot_monthly
#                     WHERE climate_scenario = %s AND year_measured = %s
#                 """, [climate_scenario, year_measured])
#                 rows = cursor.fetchall()
#                 columns = [col[0] for col in cursor.description]
#
#             elif climate_scenario and (year_measured is None or year_measured == '') and (
#                     station_code is None or station_code == ''):
#                 cursor.execute("""
#                     SELECT year_measured AS rowheader, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec
#                     FROM public.rainfall_pivot_monthly
#                     WHERE climate_scenario = %s
#                 """, [climate_scenario])
#                 rows = cursor.fetchall()
#                 columns = [col[0] for col in cursor.description]
#
#         data = [dict(zip(columns, row)) for row in rows]
#         return Response(data, status=status.HTTP_200_OK)
#

# class RainfallMonthlyPivotView1(APIView):
#
#     @extend_schema(
#         description="Get a pivot table with stations/years as rows and months as columns.",
#         responses={200: RainfallMonthlyPivotSerializer(many=True)},
#         parameters=[
#             OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
#             OpenApiParameter(name='year_measured', description='Year measured filter (optional)', required=False,
#                              type=int),
#             OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False,
#                              type=str)
#         ]
#     )
#     def get(self, request, *args, **kwargs):
#         climate_scenario = request.query_params.get('climate_scenario')
#         year_measured = request.query_params.get('year_measured')
#         station_code = request.query_params.get('station_code')
#
#         # No data unless climate_scenario is provided
#         if not climate_scenario:
#             return Response([], status=status.HTTP_200_OK)
#
#         rows = []
#         columns = []
#
#         with connection.cursor() as cursor:
#             # Case 1: climate_scenario + station_code (year_measured is null)
#             if climate_scenario and station_code and not year_measured:
#                 cursor.execute("""
#                     SELECT climate_scenario,station_code,year_measured, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec
#                     FROM public.rainfall_pivot_monthly
#                     WHERE climate_scenario = %s AND station_code = %s
#                 """, [climate_scenario, station_code])
#                 rows = cursor.fetchall()
#                 columns = [col[0] for col in cursor.description]
#
#             # Case 2: climate_scenario + year_measured (station_code is null)
#             elif climate_scenario and year_measured and not station_code:
#                 cursor.execute("""
#                     SELECT climate_scenario,station_code,year_measured, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec
#                     FROM public.rainfall_pivot_monthly
#                     WHERE climate_scenario = %s AND year_measured = %s
#                 """, [climate_scenario, year_measured])
#                 rows = cursor.fetchall()
#                 columns = [col[0] for col in cursor.description]
#
#             # Case 3: climate_scenario + year_measured + station_code
#             elif climate_scenario and year_measured and station_code:
#                 cursor.execute("""
#                     SELECT climate_scenario,station_code,year_measured, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec
#                     FROM public.rainfall_pivot_daily
#                     WHERE climate_scenario = %s AND year_measured = %s AND station_code = %s
#                 """, [climate_scenario, year_measured, station_code])
#                 rows = cursor.fetchall()
#                 columns = [col[0] for col in cursor.description]
#
#             # Case 4: climate_scenario only or invalid combo — return empty
#             else:
#                 return Response([], status=status.HTTP_200_OK)
#
#         data = [dict(zip(columns, row)) for row in rows]
#         return Response(data, status=status.HTTP_200_OK)
#
#
# class RainfallDailyPivotView1(APIView):
#
#     @extend_schema(
#         description="Get a pivot table with stations/years as rows and months as columns.",
#         responses={200: RainfallDailyPivotSerializer(many=True)},
#         parameters=[
#             OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
#             OpenApiParameter(name='year_measured', description='Year measured filter (optional)', required=False,
#                              type=int),
#             OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False,
#                              type=str)
#         ]
#     )
#     def get(self, request, *args, **kwargs):
#         climate_scenario = request.query_params.get('climate_scenario')
#         year_measured = request.query_params.get('year_measured')
#         station_code = request.query_params.get('station_code')
#
#         # No data unless climate_scenario is provided
#         if not climate_scenario:
#             return Response([], status=status.HTTP_200_OK)
#
#         if not station_code:
#             return Response([], status=status.HTTP_200_OK)
#
#         if not year_measured:
#             return Response([], status=status.HTTP_200_OK)
#
#         rows = []
#         columns = []
#
#         with connection.cursor() as cursor:
#             cursor.execute("""
#                 SELECT climate_scenario, year_measured, station_code, month_day, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec
#                 FROM public.rainfall_pivot_daily
#                 WHERE climate_scenario = %s AND year_measured = %s AND station_code = %s
#             """, [climate_scenario, year_measured, station_code])
#             rows = cursor.fetchall()
#             columns = [col[0] for col in cursor.description]
#
#         data = [dict(zip(columns, row)) for row in rows]
#         return Response(data, status=status.HTTP_200_OK)
#

def get_model_enum_values(model, field):
    return list(
        model.objects.values_list(field, flat=True)
        .distinct()
        # .exclude(**{f"{field}__isnull": True})
        .order_by(field)
    )


class RainfallPivotDailyAPIView(APIView):
    def get_queryset(self, request):
        qs = RainfallPivotDaily.objects.all()
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        if climate_scenario:
            qs = qs.filter(climate_scenario__icontains=climate_scenario)
        if year_measured:
            qs = qs.filter(year_measured=year_measured)
        if station_code:
            qs = qs.filter(station_code__icontains=station_code)
        return qs

    @extend_schema(
        summary="Get daily rainfall pivot data",
        parameters=[
            OpenApiParameter(
                name="climate_scenario",
                type=str,
                location=OpenApiParameter.QUERY,
                enum=get_model_enum_values(ClimateScenario, 'climate_scenario'),
                required=False
            ),
            OpenApiParameter(
                name="year_measured",
                type=int,
                location=OpenApiParameter.QUERY,
                enum=get_model_enum_values(Rainfall, 'year_measured'),
                required=False
            ),
            OpenApiParameter(
                name="station_code",
                type=str,
                location=OpenApiParameter.QUERY,
                enum=get_model_enum_values(Station, 'code'),
                required=False
            ),
        ],
        responses={200: RainfallPivotDailySerializer(many=True)}
    )
    def get(self, request):
        queryset = self.get_queryset(request)
        serializer = RainfallPivotDailySerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RainfallPivotMonthlyAPIView(APIView):
    def get_queryset(self, request):
        qs = RainfallPivotMonthly.objects.all()
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        if climate_scenario:
            qs = qs.filter(climate_scenario=climate_scenario)
        if year_measured:
            qs = qs.filter(year_measured=year_measured)
        if station_code:
            qs = qs.filter(station_code=station_code)
        return qs

    @extend_schema(
        summary="Get monthly rainfall pivot data",
        parameters=[
            OpenApiParameter(
                name="climate_scenario",
                type=str,
                location=OpenApiParameter.QUERY,
                enum=get_model_enum_values(ClimateScenario, 'name'),
                required=False
            ),
            OpenApiParameter(
                name="year_measured",
                type=int,
                location=OpenApiParameter.QUERY,
                enum=get_model_enum_values(Rainfall, 'year_measured'),
                required=False
            ),
            OpenApiParameter(
                name="station_code",
                type=str,
                location=OpenApiParameter.QUERY,
                enum=get_model_enum_values(Station, 'code'),
                required=False
            ),
        ],
        responses={200: RainfallPivotMonthlySerializer(many=True)}
    )
    def get(self, request):
        queryset = self.get_queryset(request)
        serializer = RainfallPivotMonthlySerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
