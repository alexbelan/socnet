from rest_framework import pagination
from rest_framework.response import Response
from .models import Groups


class GroupPostsPagination(pagination.LimitOffsetPagination):

    page_size = 5

    def get_paginated_response(self, data, user_id):

        new_data = []

        length = len(data)

        for key in range(length):

            group = Groups.objects.get(id=data[key]['group'])

            is_like = user_id in data[key]['likes']
            is_repost = user_id in data[key]['reposts']

            new_data.append({
                "id": data[key]['id'],
                "text": data[key]['text'],
                "num_likes": len(data[key]['likes']),
                "num_reposts": len(data[key]['reposts']),
                "is_like": is_like,
                "is_repost": is_repost,
                "group": {
                    "id": group.id,
                    "name": group.name,
                }
            })

        return Response({
            'next': self.get_next_link(),
            'results': new_data
        })