<script>
	import licenceIcon from '$lib/assets/cc-by-nc-sa.png';
	import Zitierempfehlung from '$lib/components/Zitierempfehlung.svelte';
</script>

<svelte:head>
	<title>Impressum</title>
</svelte:head>

<div class="container mx-auto typography">
	<h1>Impressum</h1>
	<p>
		Die auf der Plattform <i>parzival.unibe.ch</i> realisierte digitale Ausgabe des ›Parzival‹-Romans
		Wolframs von Eschenbach ist ein Projekt der Universität Bern, das parallel zur Konzeption einer gedruckten
		Ausgabe entstanden ist.
	</p>
	<!--$Als DOI-Referenz für die ganze digitale Edition gilt: https://doi.org/xxx/parzival.unibe.ch.-->
	<p>
		Die digitale ›Parzival‹-Ausgabe wurde in den Jahren 2006 bis 2026 durch ein von Prof. Dr.
		Michael Stolz am Institut für Germanistik der Universität Bern geleitetes Editionsteam
		erarbeitet. Von 2012 bis 2017 bestand eine Kooperation mit Partnerinstitutionen an der
		Berlin-Brandenburgischen Akademie der Wissenschaften und der Friedrich-Alexander-Universität
		Erlangen-Nürnberg.
	</p>
	<p>
		Projektadresse: Universität Bern, Institut für Germanistik, Länggassstr. 49, CH-3012 Bern,
		Schweiz.
	</p>
	<p>Herausgebende und Ansprechpartner</p>
	<ul class="list-inside">
		<li>
			Prof. Dr. Michael Stolz (<a href="mailto:michael.stolz@unibe.ch">michael.stolz@unibe.ch</a>)
		</li>
		<li>PD Dr. Stefan Abel (<a href="mailto:stefan.abel@unibe.ch">stefan.abel@unibe.ch</a>)</li>
	</ul>
	<p>
		Die digitale ›Parzival‹-Ausgabe wurde gefördert durch den Schweizerischen Nationalfonds, die
		Deutsche Forschungsgemeinschaft, die Universität Bern und weitere lokale Einrichtungen.
	</p>
	<p>
		Die technische Realisierung erfolgte durch das Parzival-Projekt und das Data Science Lab (beide
		Universität Bern). Das Frontend der Webanwendung basiert auf Svelte, einem modernen
		JavaScript-Framework für die Erstellung hochgradig interaktiver und effizienter
		Benutzeroberflächen.
	</p>
	<h2>Rechtliche Hinweise</h2>
	<h3>1. Allgemeine Hinweise</h3>
	<p>
		Die Plattform <i>parzival.unibe.ch</i> kann ohne Registrierung und kostenlos besucht werden. Es werden
		keine personenbezogenen Daten wie Name, Adresse oder E-Mail erhoben. Durch die Nutzung dieser Website
		erklären Sie sich mit der Erhebung, Verarbeitung und Nutzung von Daten gemäß der nachfolgenden Beschreibung
		einverstanden.
	</p>
	<h3>2. Lokale Datenspeicherung</h3>
	<p>
		Wir verwenden den sessionStorage Ihres Browsers zur lokalen Speicherung von funktionalen
		Metadaten zum Betrieb der Applikation.
	</p>
	<p>Diese Daten verbleiben auf Ihrem Gerät und werden nicht an unsere Server übertragen.</p>
	<h3>3. Keine Verwendung von Cookies oder Tracking</h3>
	<p>
		Die Plattform <i>parzival.unibe.ch</i> verwendet keine Cookies, keine externen Tracking-Dienste und
		sammelt keine Aktivitäten außerhalb unserer eigenen Seiten.
	</p>
	<h3>4. Änderungen</h3>
	<p>
		Diese Datenschutzerklärung kann jederzeit angepasst werden, um aktuellen rechtlichen
		Anforderungen zu entsprechen oder Änderungen unserer Dienste umzusetzen. Es gilt jeweils die zum
		Zeitpunkt Ihres Besuchs veröffentlichte Version.
	</p>
	<h3>5. Lizenz</h3>
	<p>
		Alle Editionsinhalte (mit Ausnahme der Digitalisate) sind unter der Lizenz <a
			href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
			target="_blank"
			rel="noopener noreferrer">CC-BY-NC-SA 4.0</a
		>
		zugänglich.
	</p>
	<img src={licenceIcon} alt="CC-BY-NC-SA 4.0" class="w-32 my-4" />
	<h2>Bildnachweise</h2>
	<p>
		Die Bilddigitalisate werden dank der Kooperationen mit Bibliotheken und Archiven angezeigt, die
		dem Projektteam Bilddateien aus ihrem Bestand zur Verfügung gestellt haben.
	</p>
	<p>
		Die Rechte an den in der digitalen ›Parzival‹-Ausgabe angezeigten Bilddigitalisaten liegen bei
		den bestandshaltenden Institutionen. Entsprechend müssen Fragen zur Reproduktion und
		Weiterverwendung der Bilder, z. B. in Publikationen, an die bestandshaltenden Institutionen zu
		gerichtet werden. Bei Verweisen auf die im Rahmen der digitalen ›Parzival‹-Ausgabe angezeigten
		Bilddigitalisate sind jeweils die bestandshaltende Institution und das konkrete Exemplar
		(Signatur) anzugeben.
	</p>
	<h2>Zitierempfehlung</h2>
	<Zitierempfehlung citation={{ variant: 'bare' }} />
</div>
