---
layout: default
---

# Enterprise Information Security
Infosec assists Mozillians in defining and operating security controls to ensure that data at Mozilla is protected consistently.

- we help you define the risks around your services and data
- we help projects design and implement security controls
- we maintain a risk-based inventory of systems and their functional security controls to help Mozilla management determine where to invest in security measures
- we develop a catalog of services and tools that help you appropriately secure your data
- we respond to security investigations and incidents
- we provide baseline practices and assist teams in defining their security standards

## Documentation

{% for cat in site.category-list %}
### {{ cat }}
<ul>
  {% for page in site.pages %}
    {% if page.resource == true %}
      {% for pc in page.categories %}
        {% if pc == cat %}
          <li><a href="{{ page.url | relative_url }}">{{ page.title }}</a> <em>{{ page.description }}</em></li>
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}
</ul>
{% endfor %}

## Contact
Email us: infosec [at] mozilla.com. For confidential information, encrypt your email using [our public PGP key](https://gpg.mozilla.org/pks/lookup?op=get&search=0x85D77543B3D624B63CEA9E6DBC17301B491B3F21). Our full fingerprint is `0x85D77543B3D624B63CEA9E6DBC17301B491B3F21`

For security incidents, file a bug in Bugzilla under the product/component [investigation](https://bugzilla.mozilla.org/enter_bug.cgi?product=Enterprise%20Information%20Security&component=Investigation) or [incidents](https://bugzilla.mozilla.org/enter_bug.cgi?product=Enterprise%20Information%20Security&component=Incident).

Our IRC channel is [#infosec](irc://irc.mozilla.org/infosec) or [#security](irc://irc.mozilla.org/security) at irc.mozilla.org.

## Members
Ordered by date - newest member is last.

- Guillaume Destuynder [:kang]
- Michal Purzynski [:michal`]
- Jeff Bryner [:jeff]
- Gene Wood [:gene]
- Aaron Meihm [:alm]
- Jonathan Claudius [:claudijd]
- April King [:April]
- Alicia Smith [:phrozyn]
- Brandon Myers [:pwnbus]
- Tristan Weir [:weir]
- Andrew Krug [:andrew]

### Past & honorary members
- Julien Vehent [:ulfr]
- Joe Stevensen [:joe]
