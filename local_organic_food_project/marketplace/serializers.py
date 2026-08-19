from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Product

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'role', 'bio', 'profile_picture']


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)  # ensures full URL is returned

    class Meta:
        model = Product
        fields = ['id', 'seller', 'name', 'category', 'description', 'price', 'quantity', 'image']
