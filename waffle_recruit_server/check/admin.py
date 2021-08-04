from django.contrib import admin

# Register your models here.
from django.contrib.auth.models import User

from check.models import Solver, Profile
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from django.contrib.admin import SimpleListFilter

# below lines should be added

class SolverInline(admin.TabularInline):
    model = Solver


class ProfileInline(admin.TabularInline):
    model = Profile



class UserAdmin(BaseUserAdmin):
    inlines = [SolverInline,ProfileInline]
    list_display = ("username","email","major","grade","solved","credential")

    def major(self,obj):
        return Profile.objects.get(user=obj).major

    def grade(self,obj):
        return Profile.objects.get(user=obj).grade

    def credential(self,obj):
        return Profile.objects.get(user=obj).credential

    def solved(self, obj):
        return list(map(lambda x:x['problem_num'],Solver.objects.filter(user=obj).values('problem_num').all()))

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


