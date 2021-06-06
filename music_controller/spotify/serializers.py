from rest_framework import serializers
from .models import SpotifyToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyToken
        fields = ('refresh_token', 'access_token', 'expires_in', 'token_type')
