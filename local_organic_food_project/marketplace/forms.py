from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile

class SignUpForm(UserCreationForm):
    ROLE_CHOICES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    )
    role = forms.ChoiceField(choices=ROLE_CHOICES, widget=forms.RadioSelect)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2', 'role')


# -- form -- -- form ---- form ---- form ---- form ---- form --

from django import forms
from .models import SellerProfile

class SellerProfileForm(forms.ModelForm):
    class Meta:
        model = SellerProfile
        fields = ['farm_name', 'description', 'location', 'farm_photo']
