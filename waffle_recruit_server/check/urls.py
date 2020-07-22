from django.urls import path

from check import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('prob/<prob_num>/', views.grade, name='grade'),
    path('solvers/<prob_num>/', views.prob_solvers, name='prob_solvers'),
    path('token/', views.token, name='token')
]
