from django.shortcuts import render

# Create your views here.
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
# from django.views.generic.list import ListView

from django.urls import reverse_lazy
from api.models import Rainfall, Temperature, Discharge,Station
from .forms import RainfallForm, TemperatureForm, DischargeForm,StationForm
from django.http import JsonResponse

class BaseCRUDView:
    success_url = reverse_lazy('index')
    template_name = 'core/form.html'


# Station
class StationListView(ListView):
    model = Station
    template_name = 'core/station_list.html'

class StationCreateView(BaseCRUDView, CreateView):
    model = Station
    form_class = StationForm

class StationUpdateView(BaseCRUDView, UpdateView):
    model = Station
    form_class = StationForm

class StationDeleteView(DeleteView):
    model = Station
    success_url = reverse_lazy('station_list')
    template_name = 'core/confirm_delete.html'


class StationListJsonView(ListView):
    model = Station
    paginate_by = 10  # fallback if DataTables params aren't passed

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search[value]', '').strip()
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

    def render_to_response(self, context, **response_kwargs):
        draw = int(self.request.GET.get('draw', 1))
        start = int(self.request.GET.get('start', 0))
        length = int(self.request.GET.get('length', 10))

        qs = context['object_list']
        total = self.get_queryset().count()
        paginated_qs = qs[start:start + length]

        data = [
            {
                "code": obj.code,
                "name": obj.name,
                "longitude": obj.longitude,
                "latitude": obj.latitude,
                "status": obj.status,
            }
            for obj in paginated_qs
        ]

        return JsonResponse({
            "draw": draw,
            "recordsTotal": total,
            "recordsFiltered": total,
            "data": data,
        }, **response_kwargs)


# Rainfall
class RainfallListView(ListView):
    model = Rainfall
    template_name = 'core/rainfall_list.html'

class RainfallCreateView(BaseCRUDView, CreateView):
    model = Rainfall
    form_class = RainfallForm

class RainfallUpdateView(BaseCRUDView, UpdateView):
    model = Rainfall
    form_class = RainfallForm

class RainfallDeleteView(DeleteView):
    model = Rainfall
    success_url = reverse_lazy('rainfall_list')
    template_name = 'core/confirm_delete.html'


# Discharge
class DischargeListView(ListView):
    model = Discharge
    template_name = 'core/discharge_list.html'

class DischargeCreateView(BaseCRUDView, CreateView):
    model = Discharge
    form_class = DischargeForm

class DischargeUpdateView(BaseCRUDView, UpdateView):
    model = Discharge
    form_class = DischargeForm

class DischargeDeleteView(DeleteView):
    model = Discharge
    success_url = reverse_lazy('discharge_list')
    template_name = 'core/confirm_delete.html'


# Temperature
class TemperatureListView(ListView):
    model = Temperature
    template_name = 'core/temperature_list.html'

class TemperatureCreateView(BaseCRUDView, CreateView):
    model = Temperature
    form_class = TemperatureForm

class TemperatureUpdateView(BaseCRUDView, UpdateView):
    model = Temperature
    form_class = TemperatureForm

class TemperatureDeleteView(DeleteView):
    model = Temperature
    success_url = reverse_lazy('temperature_list')
    template_name = 'core/confirm_delete.html'
