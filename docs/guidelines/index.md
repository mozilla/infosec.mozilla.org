# Guidelines

<ul>
  {% for page in site.pages %}
    {% if page.resource == true %}
      {% if page.categories.size == 1 and page.categories[0] == 'Guidelines' %}
          <li><a href="{{ page.url }}">{{ page.title }}</a> <em>{{ page.description }}</em></li>
      {% endif %}
    {% endif %}
  {% endfor %}
</ul>

### Risk assessment

<ul>
  {% for page in site.pages %}
    {% if page.resource == true %}
      {% if page.categories contains 'Guidelines' and page.categories contains 'Risk' %}
        <li><a href="{{ page.url }}">{{ page.title }}</a> <em>{{ page.description }}</em></li>
      {% endif %}
    {% endif %}
  {% endfor %}
</ul>

### IAM

<ul>
  {% for page in site.pages %}
    {% if page.resource == true %}
      {% if page.categories contains 'Guidelines' and page.categories contains 'IAM' %}
          <li><a href="{{ page.url }}">{{ page.title }}</a> <em>{{ page.description }}</em></li>
      {% endif %}
    {% endif %}
  {% endfor %}
</ul>
