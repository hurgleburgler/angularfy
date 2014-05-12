from tastypie.resources import ModelResource
from tastypie import fields, utils
from angularfy.models import Owner, Entity, Application, Loc, KeyFactor, Goal, Industry

class OwnerResource(ModelResource):
    created_on = fields.DateTimeField(readonly=True, default=utils.now)
    updated_on = fields.DateTimeField(readonly=True)

    class Meta:
        queryset = Owner.objects.all()
        resource_name = 'owners'

class IndustryResource(ModelResource):
    class Meta:
        queryset = Industry.objects.all()
        resource_name = 'industries'

class EntityResource(ModelResource):
    created_on = fields.DateTimeField(readonly=True, default=utils.now)
    updated_on = fields.DateTimeField(readonly=True)
    owners = fields.ToOneField(OwnerResource, 'owner', full=True)
    ein = fields.CharField(help_text='Employer Identification Number')
    industry = fields.ToOneField(IndustryResource, 'industry', full=True)

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

