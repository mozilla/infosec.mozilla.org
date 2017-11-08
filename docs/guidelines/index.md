---
layout: default
---

# Guidelines

<ul>
  {% for page in site.pages %}
    {% if page.resource == true %}
      {% for pc in page.categories %}
        {% if pc == 'Guidelines' %}
          <li><a href="{{ page.url }}">{{ page.title }}</a> <em>{{ page.description }}</em></li>
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}
</ul>
