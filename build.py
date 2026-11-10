#!/usr/bin/env python3
"""Assemble src/* en un index.html autonome (aucune dépendance, hors polices Google facultatives)."""
import pathlib
root = pathlib.Path(__file__).parent
frag = "".join(p.read_text(encoding="utf-8") for p in sorted((root / "src").glob("[1-8]-*")))
frag = frag.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
head, body = frag.split('</style>', 1)
head += '</style>'
page = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#E8ECE7" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F1614" media="(prefers-color-scheme: dark)">
<meta name="description" content="Séances de poids du corps avec coach animé, chrono, étirements, ambiance sonore et voix. Usage privé et familial.">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Séance">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
{head}
</head>
<body>
{body}
<script>if("serviceWorker"in navigator&&location.protocol!=="file:"){{addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{{}}))}}</script>
</body>
</html>
'''
(root / "index.html").write_text(page, encoding="utf-8")
print("index.html", len(page), "octets")
