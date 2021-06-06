from .models import SpotifyToken
from django.shortcuts import render, redirect
from rest_framework.views import APIView
from decouple import config
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from .serializers import UserSerializer
from api.models import Room
# from api.models import Room


class AuthURL(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):

        code = request.GET.get(self.lookup_url_kwarg)

        # scopes set a guideline so that application can access the desired access points from the spotify product
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('POST', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': config('REDIRECT_URI'),
            'client_id': config('CLIENT_ID'),
            'state': code
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    user = request.GET.get('state')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': config('REDIRECT_URI'),
        'client_id': config('CLIENT_ID'),
        'client_secret': config('CLIENT_SECRET')
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    update_or_create_user_tokens(
        access_token, token_type, expires_in, refresh_token, user)

    return redirect("http://localhost:3000/loggedin")


class IsAuthenticated(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)

        is_authenticated = is_spotify_authenticated(code)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class GetDetails(APIView):

    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        details = SpotifyToken.objects.filter(user=code)
        data = UserSerializer(details[0]).data
        return Response(data, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    lookup_url_kwarg = 'room-code'

    def get(self, request, format=None):
        room_code = request.GET.get(self.lookup_url_kwarg)
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }

        return Response(song, status=status.HTTP_200_OK)


class PauseSong(APIView):
    lookup_url_kwarg = "code"

    def put(self, request, format=None):
        room_code = request.GET.get(self.lookup_url_kwarg)
        room = Room.objects.filter(code=room_code)[0]
        # if self.request.session.session_key == room.host or room.guest_can_pause:
        pause_song(room.host)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

        # return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    lookup_url_kwarg = "code"

    def put(self, request, format=None):

        room_code = request.GET.get(self.lookup_url_kwarg)
        room = Room.objects.filter(code=room_code)[0]
        # if self.request.session.session_key == room.host or room.guest_can_pause:
        play_song(room.host)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

       # return Response({}, status=status.HTTP_403_FORBIDDEN)
