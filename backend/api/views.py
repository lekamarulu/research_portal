import io
import calendar
import pandas as pd
from django.db import connection

from django.http import HttpResponse
from django.db.models import Sum
from drf_spectacular.types import OpenApiTypes
from reportlab.pdfgen import canvas

from rest_framework import viewsets, status
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
)

from .models import ClimateScenario, Rainfall, Station
from .serializers import ClimateScenarioSerializer, RainfallSerializer, StationSerializer, RainfallPivotSerializer, StationMonthlyPivotSerializer
from .filters import RainfallFilter

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
class RainfallViewSet(viewsets.ModelViewSet):
    queryset = Rainfall.objects.all()
    serializer_class = RainfallSerializer
    filterset_class = RainfallFilter
    pagination_class = None


class RainfallMonthlyPivotView1(APIView):

    @extend_schema(
        description="Get a dynamic pivot table of rainfall data.",
        responses={200: RainfallPivotSerializer(many=True)},
        parameters=[
            OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
            OpenApiParameter(name='year_measured', description='Year measured filter', required=True, type=int),
            OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False,
                             type=str)
        ]
    )
    def get(self, request, *args, **kwargs):
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        # Step 1: Get station codes
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
            """, [climate_scenario, year_measured, station_code, station_code])
            station_codes = [row[0] for row in cursor.fetchall()]

        if not station_codes:
            return Response({"detail": "No data available for the specified filters."},
                            status=status.HTTP_404_NOT_FOUND)

        # Step 2: Build dynamic SQL for crosstab
        column_list = ", ".join([f'"{code}" float' for code in station_codes])
        crosstab_columns = ", ".join([f'"{code}"' for code in station_codes])

        crosstab_query = f"""
            SELECT month_measured, {crosstab_columns}
            FROM crosstab(
                $$
                SELECT month_measured, station_code, rainfall_max
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY month_measured, station_code
                $$,
                $$
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
                $$
            ) AS pivot_table (
                month_measured int,
                {column_list}
            );
        """

        # Step 3: Execute the pivot query
        with connection.cursor() as cursor:
            cursor.execute(crosstab_query, [
                climate_scenario, year_measured, station_code, station_code,
                climate_scenario, year_measured, station_code, station_code
            ])
            rows = cursor.fetchall()

        if not rows:
            return Response({"detail": "No data found for the specified filters."}, status=status.HTTP_404_NOT_FOUND)

        # Step 4: Structure results to match serializer
        data = []
        for row in rows:
            month = row[0]
            values = {station: row[i + 1] for i, station in enumerate(station_codes)}
            data.append({
                'month_measured': month,
                'stations': values
            })

        serializer = RainfallPivotSerializer(data=data, many=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RainfallMonthlyPivotView2(APIView):

    @extend_schema(
        description="Get a dynamic pivot table of rainfall data.",
        responses={200: RainfallPivotSerializer(many=True)},
        parameters=[
            OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
            OpenApiParameter(name='year_measured', description='Year measured filter', required=True, type=int),
            OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False,
                             type=str)
        ]
    )
    def get(self, request, *args, **kwargs):
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        # Step 1: Get station codes
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
            """, [climate_scenario, year_measured, station_code, station_code])
            station_codes = [row[0] for row in cursor.fetchall()]

        if not station_codes:
            return Response({"detail": "No data available for the specified filters."},
                            status=status.HTTP_404_NOT_FOUND)

        # Step 2: Build dynamic SQL for crosstab
        column_list = ", ".join([f'"{code}" float' for code in station_codes])
        crosstab_columns = ", ".join([f'"{code}"' for code in station_codes])

        crosstab_query = f"""
            SELECT month_measured, {crosstab_columns}
            FROM crosstab(
                $$
                SELECT month_measured, station_code, rainfall_max
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY month_measured, station_code
                $$,
                $$
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
                $$
            ) AS pivot_table (
                month_measured int,
                {column_list}
            );
        """

        # Step 3: Execute the pivot query
        with connection.cursor() as cursor:
            cursor.execute(crosstab_query, [
                climate_scenario, year_measured, station_code, station_code,
                climate_scenario, year_measured, station_code, station_code
            ])
            rows = cursor.fetchall()

        if not rows:
            return Response({"detail": "No data found for the specified filters."}, status=status.HTTP_404_NOT_FOUND)

        # Step 4: Structure results to match serializer
        data = []
        for row in rows:
            month = row[0]
            # values = {station: f"{row[i+1]:.2f}" if row[i+1] is not None else None for i, station in enumerate(station_codes)}
            values = {station: f"{row[i + 1]:.2f}" if row[i + 1] is not None else None for i, station in
                      enumerate(station_codes)}

            data.append({
                'month_measured': month,
                'stations': values
            })

        serializer = RainfallPivotSerializer(data=data, many=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RainfallMonthlyPivotView3(APIView):

    @extend_schema(
        description="Get a dynamic pivot table of rainfall data.",
        responses={200: RainfallPivotSerializer(many=True)},
        parameters=[
            OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
            OpenApiParameter(name='year_measured', description='Year measured filter', required=True, type=int),
            OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False,
                             type=str)
        ]
    )
    def get(self, request, *args, **kwargs):
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        # Step 1: Get station codes
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
            """, [climate_scenario, year_measured, station_code, station_code])
            station_codes = [row[0] for row in cursor.fetchall()]

        if not station_codes:
            return Response({"detail": "No data available for the specified filters."},
                            status=status.HTTP_404_NOT_FOUND)

        # Step 2: Build dynamic SQL for crosstab
        column_list = ", ".join([f'"{code}" float' for code in station_codes])
        crosstab_columns = ", ".join([f'"{code}"' for code in station_codes])

        crosstab_query = f"""
            SELECT month_name, {crosstab_columns}
            FROM crosstab(
                $$
                SELECT month_name, station_code, rainfall_max
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY month_name, station_code
                $$,
                $$
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
                $$
            ) AS pivot_table (
                month_name character varying(25),
                {column_list}
            );
        """

        # Step 3: Execute the pivot query
        with connection.cursor() as cursor:
            cursor.execute(crosstab_query, [
                climate_scenario, year_measured, station_code, station_code,
                climate_scenario, year_measured, station_code, station_code
            ])
            rows = cursor.fetchall()

        if not rows:
            return Response({"detail": "No data found for the specified filters."}, status=status.HTTP_404_NOT_FOUND)

        # Step 4: Structure results to match serializer
        data = []
        for row in rows:
            month = row[0]
            # values = {station: f"{row[i+1]:.2f}" if row[i+1] is not None else None for i, station in enumerate(station_codes)}
            values = {station: f"{row[i + 1]:.2f}" if row[i + 1] is not None else None for i, station in
                      enumerate(station_codes)}

            data.append({
                'month_name': month,
                'stations': values
            })

        serializer = RainfallPivotSerializer(data=data, many=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RainfallMonthlyPivotView4(APIView):

    @extend_schema(
        description="Get a dynamic pivot table of rainfall data, grouped by month_name.",
        responses={200: RainfallPivotSerializer(many=True)},
        parameters=[
            OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
            OpenApiParameter(name='year_measured', description='Year measured filter', required=True, type=int),
            OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False,
                             type=str)
        ]
    )
    def get(self, request, *args, **kwargs):
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        # Step 1: Get station codes
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
            """, [climate_scenario, year_measured, station_code, station_code])
            station_codes = [row[0] for row in cursor.fetchall()]

        if not station_codes:
            return Response({"detail": "No data available for the specified filters."},
                            status=status.HTTP_404_NOT_FOUND)

        # Step 2: Build dynamic SQL for crosstab using month_name
        column_list = ", ".join([f'"{code}" float' for code in station_codes])
        crosstab_columns = ", ".join([f'"{code}"' for code in station_codes])

        crosstab_query = f"""
            SELECT month_name, {crosstab_columns}
            FROM crosstab(
                $$
                SELECT month_name, station_code, ROUND(rainfall_max::numeric, 2)
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY month_name, station_code
                $$,
                $$
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
                $$
            ) AS pivot_table (
                month_name character varying(25),
                {column_list}
            );
        """

        # Step 3: Execute the pivot query
        with connection.cursor() as cursor:
            cursor.execute(crosstab_query, [
                climate_scenario, year_measured, station_code, station_code,
                climate_scenario, year_measured, station_code, station_code
            ])
            rows = cursor.fetchall()

        if not rows:
            return Response({"detail": "No data found for the specified filters."}, status=status.HTTP_404_NOT_FOUND)

        # Step 4: Structure and sort results by month order
        month_order = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

        data = []
        for row in rows:
            month = row[0]
            values = {station: row[i + 1] for i, station in enumerate(station_codes)}
            data.append({
                'month_name': month,
                'stations': values
            })

        # Sort by logical calendar order
        data.sort(key=lambda x: month_order.index(x['month_name']))

        # Step 5: Serialize and return
        serializer = RainfallPivotSerializer(data=data, many=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RainfallMonthlyPivotView5(APIView):
    def get(self, request, *args, **kwargs):
        # Extract query parameters
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        # Step 1: Get unique station codes
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
            """, [climate_scenario, year_measured, station_code, station_code])
            station_codes = [row[0] for row in cursor.fetchall()]

        if not station_codes:
            return Response({"detail": "No data available for the specified filters."},
                            status=status.HTTP_404_NOT_FOUND)

        # Step 2: Get monthly rainfall data per station and month
        station_month_data = []

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT station_code, month_name, COALESCE(SUM(rainfall_max), 0) AS total_rainfall
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                GROUP BY station_code, month_name
                ORDER BY station_code, month_name
            """, [climate_scenario, year_measured, station_code, station_code])

            # Process data into row format for each station
            rows = cursor.fetchall()
            for row in rows:
                station_code, month_name, total_rainfall = row
                if not any(station['station_code'] == station_code for station in station_month_data):
                    # Add a new station row
                    station_month_data.append({
                        'station_code': station_code,
                        'months': {}  # Initialize months as an empty dictionary
                    })
                # Find the station and update the month with rainfall data
                for station in station_month_data:
                    if station['station_code'] == station_code:
                        station['months'][month_name] = float(f"{total_rainfall:.2f}")

        print(station_month_data)
        # Step 3: Serialize and return the data
        serializer = StationMonthlyPivotSerializer(station_month_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RainfallMonthlyPivotView(GenericAPIView):
    serializer_class = StationMonthlyPivotSerializer()
    def get(self, request, *args, **kwargs):
        # Extract query parameters
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        # Step 1: Get unique station codes
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT station_code
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code
            """, [climate_scenario, year_measured, station_code, station_code])
            station_codes = [row[0] for row in cursor.fetchall()]

        if not station_codes:
            return Response({"detail": "No data available for the specified filters."},
                            status=status.HTTP_404_NOT_FOUND)

        # Step 2: Get monthly rainfall data per station and month
        months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        station_month_data = []

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT station_code, month_name, COALESCE(SUM(rainfall_max), 0) AS total_rainfall
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                GROUP BY station_code, month_name
                ORDER BY station_code, month_name
            """, [climate_scenario, year_measured, station_code, station_code])

            # Process data into row format for each station
            rows = cursor.fetchall()
            for row in rows:
                station_code, month_name, total_rainfall = row
                # Ensure each station entry exists
                station = next((s for s in station_month_data if s['station_code'] == station_code), None)
                if not station:
                    # Create a new station entry with all months initialized to None
                    station = {
                        'station_code': station_code,
                        'months': {month: None for month in months}
                    }
                    station_month_data.append(station)


                # Update the correct month with rainfall data
                station['months'][month_name] = float(f"{total_rainfall:.2f}")

        print(station_month_data)
        # Step 3: Serialize and return the data
        serializer = StationMonthlyPivotSerializer(station_month_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RainfallStationMonthlyPivot(APIView):

    @extend_schema(
        description="Get a pivot table with stations as rows and months as columns.",
        responses={200: StationMonthlyPivotSerializer(many=True)},
        parameters=[
            OpenApiParameter(name='climate_scenario', description='Climate scenario filter', required=True, type=str),
            OpenApiParameter(name='year_measured', description='Year measured filter', required=True, type=int),
            OpenApiParameter(name='station_code', description='Station code filter (optional)', required=False, type=str)
        ]
    )
    def get(self, request, *args, **kwargs):
        climate_scenario = request.query_params.get('climate_scenario')
        year_measured = request.query_params.get('year_measured')
        station_code = request.query_params.get('station_code')

        # Step 1: Manually define logical month order
        logical_months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                          'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

        # Step 2: Filter only the months that exist in the dataset
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT month_name
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
            """, [climate_scenario, year_measured, station_code, station_code])
            available_months = {row[0] for row in cursor.fetchall()}

        # Step 3: Final ordered list of months based on logical order
        month_names = [m for m in logical_months if m in available_months]

        if not month_names:
            return Response({"detail": "No data available for the specified filters."},
                            status=status.HTTP_200_OK)

        # Step 4: Build dynamic SQL for crosstab
        column_list = ", ".join([f'"{month}" float' for month in month_names])
        crosstab_columns = ", ".join([f'"{month}"' for month in month_names])

        crosstab_query = f"""
            SELECT station_code, {crosstab_columns}
            FROM crosstab(
                $$
                SELECT station_code, month_name, rainfall_max
                FROM rainfall
                WHERE climate_scenario = %s AND year_measured = %s
                AND (%s IS NULL OR station_code = %s)
                ORDER BY station_code, 
                         CASE month_name 
                             {' '.join([f"WHEN '{m}' THEN {i+1}" for i, m in enumerate(logical_months)])}
                             ELSE 999 
                         END
                $$,
                $$
                SELECT unnest(ARRAY[{', '.join([f"'{m}'" for m in month_names])}])
                $$
            ) AS pivot_table (
                station_code character varying(25),
                {column_list}
            );
        """

        # Step 5: Execute the pivot query
        with connection.cursor() as cursor:
            cursor.execute(crosstab_query, [
                climate_scenario, year_measured, station_code, station_code
            ])
            rows = cursor.fetchall()

        if not rows:
            return Response({"detail": "No data found for the specified filters."},
                            status=status.HTTP_404_NOT_FOUND)

        # Step 6: Structure results
        data = []
        for row in rows:
            station = row[0]
            values = {
                month: f"{row[i + 1]:.2f}" if row[i + 1] is not None else None
                for i, month in enumerate(month_names)
            }
            data.append({
                'station_code': station,
                'months': values
            })

        return Response(data, status=status.HTTP_200_OK)

class ExportRainfallExcelView(APIView):
    @extend_schema(
        parameters=[
            OpenApiParameter(name='climate_scenario', type=str, required=False, location=OpenApiParameter.QUERY),
            OpenApiParameter(name='year_measured', type=int, required=False, location=OpenApiParameter.QUERY),
            OpenApiParameter(name='station', type=str, required=False, location=OpenApiParameter.QUERY),
        ],
        responses={200: OpenApiTypes.OBJECT}
    )
    def get(self, request):
        qs = Rainfall.objects.all().values()
        df = pd.DataFrame(qs)
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=rainfall.xlsx'
        df.to_excel(response, index=False)
        return response


class ExportRainfallPDFView(APIView):
    @extend_schema(
        parameters=[
            OpenApiParameter(name='climate_scenario', type=str, required=False, location=OpenApiParameter.QUERY),
            OpenApiParameter(name='year_measured', type=int, required=False, location=OpenApiParameter.QUERY),
            OpenApiParameter(name='station', type=str, required=False, location=OpenApiParameter.QUERY),
        ],
        responses={200: OpenApiTypes.OBJECT}
    )
    def get(self, request):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer)
        p.drawString(100, 800, "Rainfall Report")
        p.showPage()
        p.save()
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')
