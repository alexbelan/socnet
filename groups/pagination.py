from rest_framework import pagination
from rest_framework.response import Response
from .models import Groups


class GroupPostsPagination(pagination.PageNumberPagination):
    page_size = 25

    def get_paginated_response(self, data):

        new_data = []

        length = len(data)

        for key in range(length):

            group = Groups.objects.get(id=data[key]['group'])

            new_data.append({
                "id": data[key]['id'],
                "text": data[key]['text'],
                "num_likes": len(data[key]['likes']),
                "num_reposts": len(data[key]['reposts']),
                "group": {
                    "id": group.id,
                    "name": group.name,
                }
            })

        return Response({
            'links': {
                'next': self.get_next_link(),
            },
            'count': self.page.paginator.count,
            'results': new_data
        })