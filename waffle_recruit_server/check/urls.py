from django.urls import path

from check import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signin/', views.signin, name='signin'),
    path('signout/', views.signout, name='signout'),
    path('prob/<prob_num>/', views.problem, name='grade'),
    path('solvers/<prob_num>/', views.prob_solvers, name='prob_solvers'),
    path('prob/<prob_num>/solution/', views.prob_solution, name='prob_solution'),
    path('token/', views.token, name='token'),
    path('skel/<lang>', views.skeleton, name='skel')
]
