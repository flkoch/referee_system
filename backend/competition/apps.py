from django.apps import AppConfig


class CompetitionConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "competition"

    def ready(self):
        import competition.signals  # noqa: F401

        return super().ready()
