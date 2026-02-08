from django.db import models

class RequestHistory(models.Model):
    repo_path = models.CharField(max_length=500)
    query = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.repo_path} - {self.timestamp}"