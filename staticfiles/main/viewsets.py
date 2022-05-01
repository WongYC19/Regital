from rest_framework import viewsets
from .models import Profile
from .serializers import ResumeSerializer

# from collections import namedtuple

# Timeline = namedtuple('Timeline', ('tweets', 'articles'))

# class TimelineViewSet(viewsets.ViewSet):
#     """
#     A simple ViewSet for listing the Tweets and Articles in your Timeline.
#     """
#     def list(self, request):
#         timeline = Timeline(
#             tweets=Tweet.objects.all(),
#             articles=Article.objects.all(),
#         )
#         serializer = TimelineSerializer(timeline)
#         return Response(serializer.data)


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer

    def get_queryset(self):
        return Profile.objects.all()
        
