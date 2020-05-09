from rest_framework.pagination import LimitOffsetPagination


class MessagesPagination(LimitOffsetPagination):
    page_size = 10

    def get_paginated(self, data):
        return {
            "next": self.get_next_link(),
            'results': data
        }