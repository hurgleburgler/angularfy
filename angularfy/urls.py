from django.conf.urls import patterns, url
from django.views.generic import TemplateView
from angularfy.views import views

# RESTful stuffs
from tastypie.api import Api
from angularfy.api import OwnerResource, EntityResource, ApplicationResource, LocResource, KeyFactorResource, GoalResource, IndustryResource, Option5Resource, FinancialsResource
from django.conf.urls import include

v1_api = Api(api_name='v1')
v1_api.register(OwnerResource())
v1_api.register(EntityResource()) 
v1_api.register(ApplicationResource()) 
v1_api.register(LocResource()) 
v1_api.register(KeyFactorResource()) 
v1_api.register(GoalResource()) 
v1_api.register(IndustryResource()) 
v1_api.register(Option5Resource()) 
v1_api.register(FinancialsResource()) 

urlpatterns = patterns('',
    url(r'^api/', include(v1_api.urls)),
    url(r'^$', views.home, name='home'),
    url(r'^loc$', TemplateView.as_view(template_name='loc.html')),
    url(r'^loan$', TemplateView.as_view(template_name='loan.html')),
)
