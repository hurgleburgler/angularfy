from django.db import models


class Owner(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=75)
    credit_score = models.IntegerField()
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

class Entity(models.Model):
    name = models.CharField(max_length=50, unique=True)
    ein = models.CharField(blank=True, null=True, max_length=10, unique=True)
    owners = models.ManyToManyField('Owner')
    industry = models.ForeignKey('Industry')
    sector = models.CharField(max_length=50, blank=True, null=True)
    years = models.PositiveIntegerField(default=0)
    revenue = models.DecimalField(max_digits=10, decimal_places=2)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Application(models.Model):
    company = models.ForeignKey('Entity', related_name='application_company')
    created_on = models.DateTimeField(auto_now_add=True)
    completed_on = models.DateTimeField()
    updated_on = models.DateTimeField(auto_now=True)
    goals = models.TextField()
    completed = models.BooleanField(default=False)
    approved = models.BooleanField(default=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    originator = models.ForeignKey('Entity', related_name='application_originator')

    def __str__(self):
        return self.name

class Loc(models.Model):
    application = models.ForeignKey('Application')
    created_on = models.DateTimeField(auto_now_add=True)
    completed_on = models.DateTimeField()
    updated_on = models.DateTimeField(auto_now=True)

class KeyFactor(models.Model):
    description = models.TextField()
    alignment = models.BooleanField()

class Goal(models.Model):
    description = models.TextField()

class Industry(models.Model):
    description = models.TextField()

class Financials(models.Model):
    revenue = models.PositiveIntegerField(default=0)
    expenses = models.PositiveIntegerField(default=0)
    debt = models.PositiveIntegerField(default=0)
    entity = models.ForeignKey('Entity')

class Option5(models.Model):
    option1 = models.TextField(default='option1')
    option2 = models.TextField(default='option2')
    option3 = models.CharField(default='option3', max_length=50)
    option4 = models.CharField(default='option4', max_length=50)
