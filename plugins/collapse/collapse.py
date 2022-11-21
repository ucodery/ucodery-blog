# -*- coding: utf-8 -*-

from docutils.parsers.rst import directives
from sphinx_toolbox.collapse import CollapseDirective, CollapseNode, depart_collapse_node, visit_collapse_node

from nikola.plugin_categories import RestExtension
from nikola.plugins.compile.rest import add_node


class Plugin(RestExtension):

	name = "collapse"

	def set_site(self, site):
		self.site = site
		directives.register_directive("collapse", CollapseDirective)
		add_node(CollapseNode, visit_collapse_node, depart_collapse_node)
		return super(Plugin, self).set_site(site)
