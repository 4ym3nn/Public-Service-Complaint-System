from rest_framework import generics, permissions
from .models import Complaint
from .serializers import ComplaintSerializer
from rest_framework import generics, permissions
from .models import Complaint
from .serializers import ComplaintSerializer
from .permissions import IsOfficerOrAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count



class ComplaintCreateView(generics.CreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(citizen=self.request.user)

class MyComplaintsView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.filter(citizen=self.request.user)
class ComplaintListView(generics.ListAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsOfficerOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status", "citizen__username", "created_at"]
class ComplaintUpdateView(generics.UpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsOfficerOrAdmin]
    http_method_names = ["patch", "put"]
class ComplaintStatsView(APIView):
    permission_classes = [IsOfficerOrAdmin]

    def get(self, request):
        stats = Complaint.objects.values("status").annotate(count=Count("status"))
        return Response(stats)

