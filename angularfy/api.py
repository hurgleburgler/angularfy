from tastypie.resources import ModelResource, ALL
from tastypie import fields, utils
from angularfy.models import Owner, Entity, Application, Loc, KeyFactor, Goal, Industry, Financials, Option5

class OwnerResource(ModelResource):
    created_on = fields.DateTimeField(readonly=True, default=utils.now)
    updated_on = fields.DateTimeField(readonly=True)

    class Meta:
        queryset = Owner.objects.all()
        resource_name = 'owners'
        filtering = {
            'first_name': ALL,
            'last_name': ALL
        }

class IndustryResource(ModelResource):
    class Meta:
        queryset = Industry.objects.all()
        resource_name = 'industries'
        filtering = {
            'description': ALL
        }

class EntityResource(ModelResource):
    created_on = fields.DateTimeField(readonly=True, default=utils.now)
    updated_on = fields.DateTimeField(readonly=True)
    owners = fields.ToManyField(OwnerResource, 'owner', help_text="Owners", full=True)
    name = fields.CharField(help_text="Company Name", default="")
    ein = fields.CharField(help_text='Employer Identification Number', null=True, default="")
    sector = fields.CharField(help_text='Company Sector', null=True, default="")
    industry = fields.ToOneField(IndustryResource, 'industry', help_text="Business Industry")
    years = fields.IntegerField(help_text="Years in Business", default="1")
    revenue = fields.DecimalField(help_text="Monthly Revenue", default="100.00")

    class Meta:
        queryset = Entity.objects.all()
        resource_name = 'entities'

class ApplicationResource(ModelResource):
    created_on = fields.DateTimeField(readonly=True, default=utils.now)
    updated_on = fields.DateTimeField(readonly=True)

    class Meta:
        queryset = Application.objects.all()
        resource_name = 'applications'

class LocResource(ModelResource):
    created_on = fields.DateTimeField(readonly=True, default=utils.now)
    updated_on = fields.DateTimeField(readonly=True)

    class Meta:
        queryset = Loc.objects.all()
        resource_name = 'locs'

class KeyFactorResource(ModelResource):
    class Meta:
        queryset = KeyFactor.objects.all()
        resource_name = 'factors'

class GoalResource(ModelResource):
    class Meta:
        queryset = Goal.objects.all()
        resource_name = 'goals'

class FinancialsResource(ModelResource):
    class Meta:
        queryset = Financials.objects.all()
        resource_name = 'financials'

class Option5Resource(ModelResource):
    class Meta:
        queryset = Option5.objects.all()
        resource_name = 'option5'

