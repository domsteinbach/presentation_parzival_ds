<script>
	import { base } from '$app/paths';
	import ErlaeuterungenExample from '$lib/components/erlaeuterungen-components/ErlaeuterungenExample.svelte';
</script>

<p>Die Ergänzung -1, -2, -3 usw. am Ende einer Versnummer bezeichnet einen Plusvers.</p>
<p>
	Die Ergänzungen -0 bzw. -01, -02, -03 kennzeichnen Paratexte (auch Bilder), wobei alle
	Überschriften mit -01 versehen sind.
</p>
<p>Paratexte wie Notizen, Marginalien, Kustoden und Reklamanten werden kursiviert wiedergegeben.</p>
<ErlaeuterungenExample href="/transkriptionen/d/8/1" label="D 8.1">
	<span class="tei-name"
		><span data-ref="regp:p0094"><span class="tei-seg9 initial Farbe: blau">G</span>Ahmvͦreth</span
		></span
	>
	ſprach ave ſan. <span class="tei-note3 marginalia">Gahmuret</span>
</ErlaeuterungenExample>
<p>Doppelt auftretende Verse erhalten die Ergänzung -r.</p>
<p>
	Die Ergänzung -a kennzeichnet Verse, die im Zusammenhang mit Kürzungen abweichen. Spezialfall R:
	-a wird verwendet für Verse, die aufgrund der für Hs. R spezifischen Versdoppelungen abweichen.
</p>
<p>
	Die Ergänzung -k kennzeichnet kontrahierte Verse, welche eine Mischung aus mehreren Versen
	darstellen.
</p>
<p>
	Verse, die Teil einer Versumstellung sind, werden am Versende mit einem vertikalen Doppelpfeil (↕)
	markiert.
</p>
<ErlaeuterungenExample href="/transkriptionen/g/460/25?" label="G 460.25">
	<span class="verse" data-verse="460.25"> </span>
	<span class="content">
		<span class="tei-milestone1 versechange"></span>
		Ame d
		<span class="tei-choice1">(e)</span>m ſaltir laſ er im gar.
	</span>
</ErlaeuterungenExample>
<p>
	Zeilenumbrüche (ausserhalb der Konvention von abgesetzten Versen) werden mit einem senkrechten
	Strich (|) markiert. Worttrennungen mit Trennungszeichen werden mit =| wiedergegeben.
</p>
<p>Initialen: rot, größere Schrift.</p>
<ErlaeuterungenExample href="/transkriptionen/d/5/29?" label="D 5.29">
	<span class="content">
		<span class="tei-seg9 initial Farbe: rot">D</span>o clagete man in ſere.
	</span>
</ErlaeuterungenExample>
<p>Prachtinitialen: rot, größere Schrift, Goldhintergrund.</p>
<ErlaeuterungenExample href="/transkriptionen/d/1/01-01?" label="D 1.1">
	<span class="content">
		<span class="tei-seg8 glory-initial">I</span>ST zwiuel h<span class="tei-choice1">(er)</span>zen
		nahgebur
	</span>
</ErlaeuterungenExample>
<p>
	Nicht ausgeführte Initialen: rot, kleinere Schrift. Hat der Schreiber den Initialbuchstaben
	vorgeschrieben, wird dieser eingesetzt. In allen anderen Fällen steht der Stellvertreter <span
		class="tei-seg1 not-executed">x</span
	>.
</p>
<ErlaeuterungenExample href="/transkriptionen/fr31/446/1" label="Fr. 31 446.1">
	<div class="tei-l" id="fr31_446.01">
		<span class="verse" data-verse="446.01">446.1<sup></sup></span>
		<span class="content">
			<span class="tei-seg1 not-executed">x</span>werſ rvͦchet hoeren dem tvͦn ich kvnt
		</span>
	</div>
</ErlaeuterungenExample>
<p>Auszeichnungen in den Handschriften (Rubrizierungen u. a.) werden orangefarbig wiedergegeben.</p>
<ErlaeuterungenExample href="/transkriptionen/u/731/13" label="U 731.13">
	<span class="content">
		Der kuͦnec
		<span class="tei-name">
			<span data-ref="regp:p0107"><span class="tei-hi1 red rot">G</span>ramoflanz</span>
		</span>
		in bot
	</span>
</ErlaeuterungenExample>

<p>
	Versalien und Majuskeln werden in Fettdruck wiedergegeben (z. B.: <span class="tei-seg7 majuscule"
		>D</span
	>iz).
</p>

<p>Überschriften: orangefarbig und fett (z. B.: <span class="tei-hi1 red rot">Her parcifal</span>).</p>
<ErlaeuterungenExample href="/transkriptionen/l/112/09-01?" label="L 112.9-01">
	<span class="content"><span class="tei-hi1 red rot">her parcifal</span></span>
</ErlaeuterungenExample>
<p>
	Vom Schreiber ausgeführte Korrekturen: Das korrigierte Wort weist hellgraue Farbe auf (für
	unlesbare Buchstaben steht *), das Korrekturresultat wird in grüner Farbe angezeigt.
</p>
<ErlaeuterungenExample href="/transkriptionen/d/747/18?" label="D 747.18">
	<span class="content">
		<span class="tei-subst2 subst_sr">
			<span class="tei-del2 deleted">daz</span>
			<span class="tei-add2 added">
				da<span class="tei-hi3 rasure rasur"><span class="tei-gap5 gap">-*-</span></span>
			</span>
		</span>
		mvͦz glichiv ſcanze ſten.
	</span>
</ErlaeuterungenExample>
<p>Vom Schreiber eingefügte Nachträge werden in grüner Farbe dargestellt.</p>
<ErlaeuterungenExample href="/transkriptionen/u/731/12" label="U 731.12">
	<span class="content"><span class="tei-add1 sr">Der wuͦnſchte die nacht vor den dac</span></span>
</ErlaeuterungenExample>
<p>
	Von einem späteren Korrektor ausgeführte Korrekturen: Das korrigierte Wort weist hellgraue Farbe
	auf (für unlesbare Buchstaben steht *), das Korrekturresultat wird in türkiser Farbe angezeigt.
</p>
<ErlaeuterungenExample href="/transkriptionen/d/53/18" label="D 53.18">
	<span class="content">
		alſ al die boͮme trvͦgent
		<span class="tei-subst1 subst_ls">
			<span class="tei-del2 deleted">got</span><span class="tei-add2 added">golt</span>
		</span>.
	</span>
</ErlaeuterungenExample>
<p>Von einem späteren Korrektor ausgeführte Nachträge werden in türkiser Farbe dargestellt.</p>
<ErlaeuterungenExample>
	<span class="content"><span class="subst_ls">vohet hie sine kintheit an</span></span>
</ErlaeuterungenExample>
<p>
	Wenn die Korrekturen durch Rasur erfolgen, stehen die korrigierten Buchstaben und Wörter auf
	dunkelgrauem Hintergrund.
</p>
<ErlaeuterungenExample href="/transkriptionen/v/731/12" label="V 731.12">
	<span class="content">
		Der wúnſchet
		<span class="tei-subst1 subst_ls">
			<span class="tei-del2 deleted">*</span>
			<span class="tei-add2 added"><span class="tei-hi3 rasure rasur">der</span></span>
		</span>
		naht fúr den tag
	</span>
</ErlaeuterungenExample>
<p>
	Ersatzlos getilgte Wörter werden in grauer Farbe und durchgestrichen wiedergegeben (z. B.: <span
		class="del_sr">hie</span
	>). Die Zeichenfolge
	<span class="tei-subst1 subst_ls">
		<span class="tei-del2 deleted">+</span>
		<span class="tei-add2 added">
			<span class="tei-hi3 rasure rasur">
				<span class="tei-gap5 gap">-*-</span>
			</span>
		</span>
	</span>
	steht für ein ersatzlos getilgtes Kreuz, das die Funktion einer Marginalie einnimmt.
</p>
<ErlaeuterungenExample href="/transkriptionen/v/141/16" label="V 141.16" class="!p-3">
	<span class="content">
		<span class="del_sr">hie</span>
		<span class="tei-subst1 subst_ls">
			<span class="tei-del2 deleted">+</span>
			<span class="tei-add2 added">
				<span class="tei-hi3 rasure rasur"><span class="tei-gap5 gap">-*-</span></span>
			</span>
		</span>
	</span>
</ErlaeuterungenExample>
<p>
	Diakritische Zeichen werden als solche dargestellt. Zirkumflex wird grundsätzlich gemäß der
	Handschrift transkribiert. Ausnahme: Zirkumflex über Diphthongen und mehr als zwei Vokalen in
	Folge wird stets über dem ersten Vokal wiedergegeben.
</p>
<p>
	Superskripte, die nicht eindeutig identifizierbar sind, werden als übergeschriebene „x“ (z. B.: uͯ)
	wiedergegeben.
</p>
<ErlaeuterungenExample href="/transkriptionen/l/8/05" label="L 8.05">
	<span class="content">An guter zuͯht von hoher art</span>
</ErlaeuterungenExample>
<p>
	Unlesbare Zeichen werden mit : bei einem, mit :: bei zwei und mit ::: bei drei oder mehr
	unleserlichen Buchstaben angegeben. Textverlust aufgrund materieller Beeinträchtigung (z. B.
	Fragmentverlust) wird in jedem Fall mit ::: bezeichnet.
</p>
<ErlaeuterungenExample href="/transkriptionen/d/3/27" label="D 3.27">
	<span class="content"
		>da fv̂re e<span class="tei-gap1 gap">:</span>n l<span class="tei-gap2 gap">::</span>g<span
			class="tei-gap4 gap">:::</span
		></span
	>
</ErlaeuterungenExample>

<p>
	Wenn der materielle Befund des Textzeugen von der Darstellung der digitalen Reproduktion abweicht,
	wird ersterer in der Transkription berücksichtigt (z. B. in <a
		href="{base}/transkriptionen/fr5/446/03?"
		target="_blank"
		rel="noopener noreferrer">Fragment 5, Bl. 4rc, Vers 446.3</a
	>, wo das Reimwort <i>zal</i> in der Reproduktion auf einem umgeklappten Seitenteil steht und nicht
	sichtbar ist).
</p>

<p>
	Die Abkürzungen werden in runden Klammern aufgelöst. Hierbei ist zu beachten, dass vn̅ in jedem
	Textzeugen dem Quantitätsprinzip entsprechend mit vn(t), vn(d) oder vn(de) aufgelöst wird.
</p>
