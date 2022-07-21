from drf_spectacular.utils import OpenApiResponse, extend_schema, extend_schema_view
from rest_framework import serializers

submit_viewset_schema = extend_schema_view(
    submit=extend_schema(
        
    )
)