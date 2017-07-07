---
layout: default
---

# Fundamentals

<ul>
  {% for page in site.pages %}
    {% if page.resource == true %}
      {% for pc in page.categories %}
        {% if pc == 'Fundamentals' %}
          <li><a href="{{ page.url | relative_url }}">{{ page.title }}</a> <em>{{ page.description }}</em></li>
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}
</ul>
