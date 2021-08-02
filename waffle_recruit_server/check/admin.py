from django.contrib import admin

# Register your models here.
from check.models import Solver, Profile

admin.site.register(Solver)
admin.site.register(Profile)
