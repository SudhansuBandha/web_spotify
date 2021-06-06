from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'vote_to_skip', 'created_at')


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('host', 'guest_can_pause', 'vote_to_skip', )


class UpdateRoomSerializer(serializers.ModelSerializer):
    # this is done so that we donot face error for using not the unique code
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'vote_to_skip', 'code')
