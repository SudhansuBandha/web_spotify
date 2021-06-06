from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
# CreateAPIView
# List all rooms


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

# Fetch details of individual room


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        # code is fetch from the parameters in the url

        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data

                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


# Create Room
class CreateRoomView(APIView):
    # we have created 2 room serializer over here | one to create a room & other to view the room
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # to check whether a session is created or not || if session is not created then it will create a new session
        '''
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        '''

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # we are fecthing all the details from the frontend and serializing them

            guest_can_pause = serializer.data.get('guest_can_pause')
            vote_to_skip = serializer.data.get('vote_to_skip')
            #host = self.request.session.session_key
            host = serializer.data.get('host')
            # here we are checking whether there is any room already present for to the current host or not
            queryset = Room.objects.filter(host=host)

            # if the room already exists for the host then we are just updating the already present room
            # else we are creating a new room for the host
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.vote_to_skip = vote_to_skip
                room.save(update_fields=['guest_can_pause', 'vote_to_skip'])

                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            vote_to_skip=vote_to_skip)
                room.save()

                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        else:
            return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)


# Join Room
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        # print(request.data.get("code"))
        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]

                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)

# update room


class UpdateRoom(APIView):

    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            vote_to_skip = serializer.data.get('vote_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            room.guest_can_pause = guest_can_pause
            room.vote_to_skip = vote_to_skip
            room.save(update_fields=['guest_can_pause', 'vote_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)
