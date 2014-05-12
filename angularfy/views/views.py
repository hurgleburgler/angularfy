from django.shortcuts import render
from django.views.generic import TemplateView


def home(request):
    context = {
        'username': 'homer@doh!nuts.com',
    }
    return render(request, 'home.html', context)

