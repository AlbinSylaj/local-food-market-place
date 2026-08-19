from django.urls import path
from django.http import HttpResponse
from . import views
from .views import (
    signup_view,
    signup_api_view,
    login_api_view,
    seller_profile_view,
    ProfileListView,
    ProductListCreateView,
    ProductDetailView,
)

def home(request):
    return HttpResponse("Marketplace backend is running!")
urlpatterns = [
    path("", home, name="home"),  # root path
    path('signup/', signup_view, name='signup'),
    path('api/signup/', signup_api_view, name='signup_api'),
    path('api/login/', login_api_view, name='login_api'),
    path('seller_profile/', seller_profile_view, name='seller_profile'),
    path('profiles/', ProfileListView.as_view(), name='profile_list'),
    path('products/', ProductListCreateView.as_view(), name='product_list_create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
    path('api/products/', ProductListCreateView.as_view(), name='api_product_list_create'),
    path('api/products/<int:pk>/', ProductDetailView.as_view(), name='api_product_detail'),
]
