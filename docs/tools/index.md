<ul>
  {% for page in site.pages %}
    {% if page.resource == true %}
      {% if page.categories.size == 1 and page.categories[0] == 'Tools' %}
          <li><a href="{{ page.url }}">{{ page.title }}</a> <em>{{ page.description }}</em></li>
      {% endif %}
    {% endif %}
  {% endfor %}
  <li><a href="https://ssl-config.mozilla.org/">SSL Configuration Generator</a></li>
</ul>
