from django.shortcuts import render, redirect
from django.http import HttpResponseForbidden
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from .forms import SignUpForm

def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            role = form.cleaned_data.get('role')
            user.profile.role = role
            user.profile.save()
            login(request, user)
            return redirect('home')  # redirect to homepage or dashboard
    else:
        form = SignUpForm()
    return render(request, 'marketplace/signup.html', {'form': form})


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_api_view(request):
    form_data = request.data.copy()
    password = form_data.get('password', '')
    form_data['password1'] = form_data.get('password1', password)
    form_data['password2'] = form_data.get('password2', password)

    form = SignUpForm(form_data)
    if not form.is_valid():
        return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)

    user = form.save()
    user.profile.role = form.cleaned_data['role']
    user.profile.save(update_fields=['role'])
    login(request, user)

    return Response(
        {'message': 'Signup successful', 'username': user.username, 'role': user.profile.role},
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login_api_view(request):
    username = request.data.get('username', '')
    password = request.data.get('password', '')
    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid username or password.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    login(request, user)
    return Response(
        {'message': 'Login successful', 'username': user.username, 'role': user.profile.role},
        status=status.HTTP_200_OK,
    )



from django.contrib.auth.decorators import login_required
from .forms import SellerProfileForm
from .models import SellerProfile

@login_required
def seller_profile_view(request):
    if request.user.profile.role != 'seller':
        return HttpResponseForbidden('Only sellers can manage a seller profile.')

    try:
        profile = request.user.sellerprofile
    except SellerProfile.DoesNotExist:
        profile = None

    if request.method == 'POST':
        form = SellerProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            seller_profile = form.save(commit=False)
            seller_profile.user = request.user
            seller_profile.save()
            return redirect('seller_profile')
    else:
        form = SellerProfileForm(instance=profile)

    return render(request, 'marketplace/seller_profile.html', {'form': form})


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .models import Profile, Product
from .serializers import ProfileSerializer, ProductSerializer

# List all profiles (buyers/sellers)
class ProfileListView(APIView):
    def get(self, request):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

# Products API
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        if self.request.user.profile.role != 'seller':
            raise PermissionDenied('Only sellers can create products.')

        try:
            seller_profile = self.request.user.sellerprofile
        except SellerProfile.DoesNotExist as error:
            raise PermissionDenied('Create a seller profile before adding products.') from error

        serializer.save(seller=seller_profile)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [IsAuthenticated()]
        return [AllowAny()]

    def _check_owner(self):
        if self.request.user.profile.role != 'seller' or self.get_object().seller.user_id != self.request.user.id:
            raise PermissionDenied('Only the seller who owns this product can change it.')

    def perform_update(self, serializer):
        self._check_owner()
        serializer.save(seller=self.get_object().seller)

    def perform_destroy(self, instance):
        self._check_owner()
        instance.delete()
