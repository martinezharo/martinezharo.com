-- The German description and story of every project that existed when the
-- German column pair was added (0007). They were translated from the English
-- text, keeping its paragraphs, lists and emphasis exactly as they are, since
-- the site draws the story from them paragraph by paragraph.
--
-- Each statement only writes where both German fields are still empty, so
-- running this after somebody has written German in the admin panel changes
-- nothing on that row. Projects added later are not listed here: their German
-- is written in the admin panel, which now has a field for it.

UPDATE projects SET
  short_description_de = 'Eine App, mit der du persönliche Streaks auf visuelle, mitreißende und befriedigende Weise festhältst.',
  history_de = 'Ich hatte mich für einen Hackathon angemeldet, ohne eine klare Vorstellung davon zu haben, welches Projekt ich einreichen wollte. Dann fiel mir ein, dass eine Freundin erwähnt hatte, sie finde keine kostenlose App, um Streaks zu verfolgen – also beschloss ich, eine zu bauen.

Ich hatte nicht genug Zeit, alle Funktionen umzusetzen, die ich mir ursprünglich vorgestellt hatte, und so fiel das Endergebnis begrenzter aus, als mir lieb war.

Mein Ergebnis beim Hackathon entsprach meiner eigenen Einschätzung des Projekts, und den Podiumsplatz, den ich mir als Ziel gesetzt hatte, habe ich nicht erreicht.

Am Ende bereute ich es, ein so simples und generisches Projekt präsentiert zu haben.

Dennoch hatte es ein paar besondere Elemente, etwa eine gepflegte Oberfläche und ein Maskottchen, um das man sich kümmern musste. Das Hauptproblem war die allgemeine Schlichtheit der Idee.

Trotzdem habe ich einiges Positive mitgenommen:

- Ich habe zum ersten Mal Convex benutzt. Es hat mir so gut gefallen, dass ich am Ende einige meiner früheren Projekte von Supabase dorthin migriert habe.
- Für die Teilnahme bekam ich mehrere Monate kostenloses VPS-Hosting, mit dem ich eine Cloud-Entwicklungsumgebung aufgesetzt habe, die ich schon lange bauen wollte.
- Ich habe zum ersten Mal Codex ausprobiert. Anfangs fand ich es ein wenig enttäuschend, vor allem weil ich Claude Code gewohnt war, aber mit der Zeit wurde es zu einem meiner liebsten Programmierwerkzeuge.'
WHERE slug = 'akin'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Ein Survival-Horrorspiel in der Ego-Perspektive für den Browser, angesiedelt in den Backrooms.',
  history_de = 'Alles begann mit einem simplen Prompt, um zu testen, was das neu erschienene Modell Fable 5 kann.

Das Ergebnis hat mich umgehauen – wobei ich fairerweise sagen muss, dass ich vorher nie wirklich versucht hatte, mit KI innerhalb eines Harness Spiele zu erzeugen.

Also blieb es einige Wochen lang kaum mehr als ein cooles Experiment, das zeigte, wozu künstliche Intelligenz fähig ist.

Später zeigte ich es jedoch einer Brieffreundin auf Slowly. Sie mochte es und spielte es mehr als einmal, was mich ermutigte, es weiterzuentwickeln und aus einem simplen Experiment ein richtiges Spiel zu machen.

Ich fügte eine Reihe von Zielen hinzu, damit es nicht länger nur ein Spiel war, in dem man ohne klares Ziel durch die Backrooms wanderte und hin und wieder auf Monster traf.

Außerdem baute ich am Ende mehrere Level ein, um das Erlebnis abwechslungsreicher zu machen.

Der unerwartetste Moment kam, als ich meine Cloudflare Analytics checkte und bemerkte, dass das Spiel Dutzende Nutzer aus China bekam. Das waren offensichtlich Bots, dachte ich. Ich hatte das Spiel nirgendwo beworben und mich kaum um SEO gekümmert.

Doch mit den Tagen sah ich immer mehr Besucher, inzwischen aus mehreren verschiedenen Ländern.

Bevor ich mich darüber freute, dass ich fast ohne Aufwand für Sichtbarkeit Nutzer bekam, beschloss ich, manuell etwas Analytics einzubauen, um herauszufinden, was diese Nutzer tatsächlich taten.

Ich wollte sehen, ob sie sich wirklich über die Karte bewegten, Level abschlossen, starben …

Und zu meiner Überraschung … ja. Es waren echte Nutzer.

Die Quelle?

Doubao empfahl das Spiel Leuten, die in China nach etwas Ähnlichem suchten, während ChatGPT dasselbe im Rest der Welt tat.'
WHERE slug = 'backrooms'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Lerne die deutschen und englischen Wörter, die du dir selbst aussuchst.',
  history_de = 'Ich hatte es satt, dass Duolingo mir zum dreiunddreißigsten Mal beibringen wollte, dass Kanada auf Deutsch *Kanada* heißt. Also beschloss ich, eine kleine App zu bauen, die sich auf die Wörter konzentriert, die ich wirklich lernen wollte.

Ich habe das visuelle Design eines meiner nutzlosesten Projekte wiederverwendet, Akin, das wenigstens ein ziemlich ordentliches Design hatte. Es fühlte sich gut an, die Arbeit, die ich in dieses gescheiterte Projekt gesteckt hatte, endlich sinnvoll zu nutzen.

Neben dem Lernen neuer Vokabeln habe ich eine Funktion eingebaut, die mir helfen soll, eine Gewohnheit aufzubauen, die ich schon länger entwickeln wollte: mehr auf Englisch zu schreiben und meine Fehler zu analysieren, um besser zu werden.'
WHERE slug = 'blitz'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Ein Online-Bekleidungsgeschäft mit einem eigenwilligen Capybara-Thema.',
  history_de = 'Parallel zu Kenobismo hatte ich auf einem Instagram-Account Capybara-Inhalte hochgeladen, ohne ihnen große Bedeutung beizumessen – nur für den Fall, dass ich eines Tages etwas mit Capybaras verkaufen wollte und schon ein Publikum hätte.

Nachdem ich mit Film-Content aufgehört hatte, war es Zeit, etwas ein bisschen Ernsthafteres zu tun, als nur Social-Media-Inhalte zu erstellen. Ich würde jetzt dieses Capybara-Ding verkaufen. Kleidung.

Ich hatte kein besonderes Interesse an Kleidung, nicht einmal persönlich. Aber meine damals begrenzte Geschäftsvorstellung sah keinen anderen Weg, ein Unternehmen zu starten.

Nach ein paar Wochen, in denen ich gerade genug lernte, T-Shirts entwarf und Shopify einrichtete, wurde EliteBara am 13. Juli 2023 geboren, mein bis dahin ernsthaftestes Projekt.

Um die Marke zu bewerben, startete ich ein Gewinnspiel in Zusammenarbeit mit dem Capybara-Account, den ich zuvor erstellt hatte. Was meiner Meinung nach zweifellos einen guten Schub an Traffic für die Social-Media-Kanäle und die Website von EliteBara bringen würde, war in Wirklichkeit ein totes Gewinnspiel mit zwei oder drei Teilnehmern.

Der Rest des Projekts lief genauso wie das Gewinnspiel: schlecht. Ich schaffte nur einen einzigen Verkauf, an dem ich kaum einen Euro verdiente.

Die T-Shirts, die ich bestellt hatte, hatten eine fragwürdige Druckqualität, die den Preis nicht rechtfertigte, den ich ansetzen musste, um keinen Verlust zu machen.

Ich hatte das Projekt mit mickrigen 50 € begonnen und naiv gedacht, das wäre mehr als genug. Aber beim ersten und einzigen Verkauf konnte ich nicht einmal sofort versenden und musste mehrere Tage warten, bis Shopify mir das Geld überwies, weil ich nicht genug hatte, um Printful für das Produkt zu bezahlen.

Ich fürchtete eine Rücksendung, was bei einem Bekleidungsgeschäft ziemlich wahrscheinlich ist, erst recht bei dieser Qualität.

Bei meinem so knappen Cashflow hätte das ein ernstes Problem werden können. Das Vernünftigste war, nach ein paar Monaten alles zu schließen, auch wenn mir nach der dreimonatigen Testphase ohnehin das Geld gefehlt hätte, um das Shopify-Abo weiter zu bezahlen.

Trotz allem ist das Wissen, das ich dabei gewonnen habe, unbezahlbar, weshalb ich es nie als Misserfolg gesehen habe.'
WHERE slug = 'elitebara'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Ein Marktplatz, der auf neue Produkte von professionellen Verkäufern spezialisiert ist.',
  history_de = 'Bevor ich Octopus Control startete, hatte ich eine Art entdeckt, online zu verkaufen, über die niemand sprach: Marktplätze wie Wallapop und Vinted.

Aber nicht so, wie sie gedacht sind – die gebrauchten Sachen verkaufen, die bei dir zu Hause herumliegen; und auch nicht, dort Produkte zu kaufen, aufzuarbeiten und weiterzuverkaufen. Meine Idee war, Produkte im Großhandel (irgendwo) einzukaufen und auf diesen Plattformen zu verkaufen. Dasselbe, was ich in einem klassischen Onlineshop mit eigener Website oder auf Amazon tun würde, aber mit dem Unterschied, dass ich hier bereits Kunden mit Kaufabsicht hätte und keine extrem komplexen Einstellungen bräuchte.

Und es lief ganz und gar nicht schlecht. Aber so effizient, wie es sein sollte, war das definitiv nicht.

Lagerbestand verwalten? Vergiss es. Nach jedem Verkauf musst du die Anzeige neu einstellen.

Varianten? Fehlanzeige. Du musst dich damit abfinden, eine neue Anzeige hochzuladen, und hoffen, dass dein Kunde zufällig auf die für ihn beste Option stößt.

Was passiert, wenn ein Kunde mehrere Stück eines Produkts oder gleich mehrere deiner Artikel kaufen will? Nun ja … lade eine neue Anzeige nur für ihn hoch!

War das der schlimmste Teil? Nein, ganz sicher nicht.

„Ist das noch verfügbar?“, „Was kostet das?“, „Hi“, „Versendest du?“, „Ich biete dir 5 €“, „Ich bin interessiert“, „Ist es neu?“ …

Wenn du professionell verkaufen willst, wird das dein tägliches Brot sein. Du kannst die professionellsten Fotos, den besten Text, einen umfangreichen, sorgfältig kuratierten Katalog haben und sogar an der NASDAQ notiert sein; für den Käufer auf diesen Plattformen bist du ein Verkäufer wie jeder andere.

Die Schuld liegt ganz bestimmt nicht bei den Käufern. Ich bezweifle stark, dass sie, wenn sie bei Amazon kaufen, vorher auch noch die Verkäufer anschreiben und um Erlaubnis bitten.

Das Problem ist die Übermenschlichung dieser Plattformen. Die Lockerheit und der Mangel an Professionalität, die man dort einatmet. Wie tief der Chat verwurzelt ist, sowohl auf der Plattform als auch in den Köpfen ihrer Nutzer.

Als wäre das alles nicht genug, gibt es noch ein letztes Problem, und vielleicht ist es die Wurzel von allem:

Die Plattformen interessieren sich nicht für dich.

Ja, du verkaufst vielleicht jeden Monat so viel wie 100 Privatverkäufer, aber der professionelle Verkäufer ist eine lächerlich kleine Minderheit. Es wäre Geschäftssuizid, anzufangen, Dinge zu ändern, die für die Mehrheit ihrer Nutzer funktionieren und die obendrein im Widerspruch zu ihrem Markenimage stünden, das auf dem Konsum von Gebrauchtem beruht.

Auf der anderen Seite der Medaille haben wir Amazon. Mangelnde Professionalität kann man dort nicht behaupten, und die Möglichkeiten, die es Verkäufern bietet, muss man nicht erklären.

Vielleicht findest du dort die Funktion, die du brauchst … nachdem du dich durch endlose Formulare gekämpft, alle Verifizierungen abgeschlossen, eine Oberfläche wie aus den Neunzigern ertragen (sorry, Jeff, aber es wird Zeit für ein Redesign) und kräftig gebetet hast, keinen Fehler zu machen, der mit einer lebenslangen Kontosperrung endet.

Nehmen wir trotz allem an, du hast die gesamte Einrichtung geschafft und die Konkurrenz ausgestochen, um deine ersten Verkäufe zu machen. Aber …

Erinnerst du dich daran, was ich über die Übermenschlichung von Wallapop und Vinted gesagt habe? Bei Amazon landen wir im genauen Gegenteil.

Weiß überhaupt jemand, bei welchem Shop er kauft?

Du weißt, dass du bei Amazon kaufst, wie lange dein Paket gebraucht hat, und vielleicht kennst du die Marke des Produkts. Aber Amazon macht es dem Käufer richtig schwer zu erkennen, dass du es warst, der verkauft hat.

Bei Amazon bist du nur ein Preis.

Wallapop und Vinted vermenschlichen den Kauf zu sehr, während Amazon dich als Verkäufer entmenschlicht.

Hier kommt Fewya ins Spiel.

Ein Marktplatz mit der einfachen Verkaufsabwicklung der genannten Plattformen, aber mit der Aufmerksamkeit, die Gründer brauchen, die gerade erst anfangen, oder stationäre Geschäfte, die beginnen wollen, online an den Rest der Welt zu verkaufen.'
WHERE slug = 'fewya'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Eine kurzlebige Dating-Plattform, die auf einen gesunden, ehrlichen und transparenten Service setzte.',
  history_de = '„Es ist wie bei den anderen Apps: Sie verdienen Geld mit deinem Scheitern“

Obwohl ich nie eine Dating-App ausprobiert hatte, zündete in meinem Kopf ein kleiner unternehmerischer Funke, als ich auf eine Bewertung stieß, die das sagte.

Ich musste die echte Alternative schaffen.

Zum ersten Mal würde ich ein Projekt angehen, das auf den Bedürfnissen eines anderen beruhte statt auf meinen eigenen. Was konnte schon schiefgehen?

Es dauerte nicht lange, bis ich anfing, es zu bauen; zum Glück hatte ich dank RANKMAKER bereits das Wissen, eine Plattform mit künstlicher Intelligenz zu erstellen.

RANKMAKER hatte keinen Login; hier würde ich ihn ganz sicher brauchen, aber zum Glück glich mein gewachsenes Verständnis von LLMs und mein besserer Umgang mit ihnen den höheren Schwierigkeitsgrad aus.

Bei der Webentwicklung war ich allerdings extrem nachlässig. Es lag nicht nur daran, dass ich nicht wusste, was ich tat, es war mir auch nicht besonders wichtig. Ich befand mich in einer etwas zerstreuten Lebensphase, und das beeinträchtigte das Produkt erheblich.

Ich schaffte es, es ein paar Monate später zu starten, obwohl ich es viel früher und besser hätte tun können, wenn ich nur etwas konzentrierter gewesen wäre.

Ich schaltete einige Instagram-Anzeigen, merkte aber ein paar Tage später, dass die Plattform nicht richtig funktionierte. Ich weiß nicht mehr genau, welche Funktion nicht ging, ob es die Likes waren oder der Login, aber es war etwas Kritisches.

Ich stoppte sofort die Investition in Werbung und fing an, endgültig Programmieren zu lernen.

Ich dachte, ich würde das Projekt wieder aufnehmen, sobald ich das nötige Wissen hätte. Doch mit der Zeit und bei nüchterner Betrachtung stellte ich fest, dass es ziemlich naiv war, mit ein paar hundert Euro eine Dating-Plattform aufzubauen; ich verwarf die Idee vollständig.

Obwohl sowohl die konzeptionellen als auch die funktionalen Ideen nicht alle schlecht waren, braucht die Welt keine weitere Dating-Plattform.'
WHERE slug = 'goal-partner'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Ein lokales, privates Tagebuch, das deine Einträge in einer .ics-Datei speichert.',
  history_de = 'Nachdem ich drei Jahre lang mein Tagebuch in der Kalender-App eines alten Handys geschrieben hatte, begann sich dessen Display vom Gehäuse zu lösen. Ich musste mein geliebtes Tagebuch retten.

Ich hätte die ICS-Datei (das Format, in dem Kalenderdaten gespeichert und ausgetauscht werden) einfach in die Kalender-App eines anderen Handys importieren können. Aber ehrlich gesagt ist es nicht gerade die bequemste Erfahrung, ein Tagebuch in einer App zu führen, die für die Terminplanung gedacht ist.

Also beschloss ich, eine App mit allen Funktionen zu bauen, die mir in diesen Jahren gefehlt hatten, und dafür zu sorgen, dass sie mein altes Tagebuch importieren kann.

Icarus arbeitet mit einer ICS-Datei, die deine Tagebucheinträge enthält. Daher kommt auch der Name: **IC**ru**S**. Obwohl diese Dateien ursprünglich nicht für Tagebücher gedacht waren und es ungewöhnlich wirken mag, sie so zu verwenden, funktionieren sie erstaunlich gut und sind besonders praktisch zum Importieren und Exportieren von Daten.

Die erste Version von Icarus war eine Linux-Anwendung, installiert auf einer separaten Partition eines Laptops, den ich ausschließlich zum Tagebuchschreiben nutzte, um so viel Privatsphäre wie möglich zu wahren.

Mit der Zeit vermisste ich jedoch den Komfort, auf dem Handy zu schreiben. Also entwickelte ich auch eine Android-App und nutzte die Gelegenheit, Icarus öffentlich zugänglich zu machen, sodass jeder es als Desktop-Anwendung auf allen gängigen Betriebssystemen, als Android-App oder einfach über das Web nutzen kann.'
WHERE slug = 'icarus'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Ein Social-Media-Projekt rund um Star-Wars-Daten, -Lore und -News, das später auf das Kino ausgeweitet wurde.',
  history_de = 'Meine Laufbahn als Unternehmer beginnt für mich im Jahr 2020, als ich einen Instagram-Account eröffnete, auf dem ich Inhalte wie Star-Wars-Trivia und Neuigkeiten postete.

Bei Followern und Kennzahlen lief es nicht schlecht, aber ich war 16 Jahre alt, die Regelmäßigkeit überforderte mich, und ich sah keinen wirklichen Nutzen darin weiterzumachen. Bevor der Account sein erstes Jubiläum erreichte, schloss ich ihn, um eine Pause auf unbestimmte Zeit einzulegen.

Monate vergingen – vielleicht mehr als ein Jahr – und 2022 stieß ich auf ein entscheidendes kurzes Video, das von einer App zum Minen von Bitcoin handelte. (Es mag so aussehen, als hätte das nichts mit Kenobismo zu tun, aber hab einen Moment Geduld.)

Ich hatte mich schon vorher für Krypto interessiert, aber nie über das Zuschauen hinaus, wie Bitcoin steigt und fällt. Nachdem ich die Mining-App fasziniert heruntergeladen und angefangen hatte, sie zu benutzen, entstand eine neue Besessenheit: Kryptowährungen. Ich sah Videos, Charts – alles.

Ein Mitschüler fragte mich, was ich tun würde, wenn ich 18 wäre. Ich überlegte ein paar Sekunden und antwortete: „Ein Binance-Konto eröffnen.“

Und das tat ich auch, obwohl ich das Binance-Konto eigentlich gar nicht nutzte. Am Ende kaufte ich Krypto an einem Automaten und legte sie in eine Wallet. Keine Börsen.

All dieses Interesse an Kryptowährungen führte mich schließlich dazu, mehr über Investieren im Allgemeinen, persönliche Finanzen und vor allem Unternehmertum zu lernen.

Das wiederum brachte mich zurück zu Kenobismo. Ich hatte ein gutes Publikum, ich konnte es ernster nehmen, und ich konnte damit Geld verdienen.

Ich startete den Instagram-Account mit Wucht neu: Regelmäßigkeit, Qualität und ein klares Ziel. Außerdem fing ich an, kurze Videos zu posten, die ich auf TikTok und YouTube erneut hochlud (mit künstlicher Stimme, nicht mit meiner eigenen).

Also beschloss ich an diesem Punkt offiziell, Unternehmer zu werden (auch wenn das Projekt schon vorher begonnen worden war).

Instagram und die anderen Plattformen wuchsen ziemlich gut. Nach einiger Zeit überholte TikTok sogar Instagram, und ich hatte ein paar großartige Monate, mit Zahlen von bis zu 50 Millionen Aufrufen.
Die Monetarisierung – zumindest auf TikTok – stand kurz bevor.

Ein paar Monate später konnte ich sie beantragen, wobei ich, wenn ich mich recht erinnere, ein bis zwei Monate auf meine erste Auszahlung warten musste.
Um sie entgegennehmen zu können, eröffnete ich mein erstes Bankkonto bei Revolut. In dem Monat waren die Aufrufe nicht berauschend, aber ich verdiente etwa 40–50 €, was sich unglaublich anfühlte.

Im folgenden Monat verdiente ich etwa 20 €. Und im Monat danach fielen meine Videos von mindestens 10.000 Aufrufen (bei durchschnittlich 50.000) alle unter 1.000. Ich wurde geshadowbannt, möglicherweise wegen filmbezogener Inhalte.

Ich lud weiter Inhalte hoch in der Hoffnung, dass es behoben würde, aber das geschah nie. Als Reaktion hörte ich auf, kurze Videos auf Kenobismo zu posten, und begann, auf einer neuen Reihe von Accounts hochzuladen, die dem Kino im Allgemeinen gewidmet waren, nicht nur Star Wars – diesmal mit meiner echten Stimme.

Ich lud genau 100 Videos hoch. Ich tat es als etwas Vorübergehendes, um dem Shadowban von Kenobismo Zeit zu geben, sich zu erholen. Ich schaffte es nicht, mit diesem Projekt irgendwelche Einnahmen zu erzielen.

Nach diesen 100 Videos ging ich zu Kenobismo zurück. Ich beschloss, dort ebenfalls allgemeine Kinovideos hochzuladen – nicht nur Star Wars – und hörte auch auf, andere Arten von Beiträgen zu veröffentlichen, um mich ausschließlich auf kurze Videos zu konzentrieren.

So blieb ich ein paar Wochen. Aber der TikTok-Shadowban hielt an. Ich entschied, dass mehr getan werden musste. Ich würde auf YouTube auf lange Videos ausweiten.

Ich fing an, alles dafür vorzubereiten, aber nur einen Tag vor der Aufnahme des ersten langen Kenobismo-Videos stieß ich auf ein weiteres Schlüsselvideo für meinen Weg: The Wild Project #219 ft Jordi Maquiavello.

Eine Folge des Podcasts, in der fast fünf Stunden lang über Kino gesprochen wurde. Einen so langen Podcast hatte ich noch nie von Anfang bis Ende gesehen. Es war der erste, und er gefiel mir sehr. Aber ich kam zu einer harten Erkenntnis: Ich hatte keine wirkliche Ahnung vom Kino – zumindest nicht genug, um es zu „lehren“.

Nachdem ich noch etwas darüber nachgedacht hatte und sah, dass das ohnehin nicht viel Zukunft hatte – und dass ich es außerdem hasste, mich selbst aufzunehmen –, hörte ich am Ende auf.

Doch gleich am Tag nach dieser Überlegung kam mir eine neue Idee in den Sinn — EliteBara.'
WHERE slug = 'kenobismo'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Web-App, um deine liebsten Code-Snippets zu speichern und von jedem Gerät aus sofort darauf zuzugreifen.',
  history_de = 'Nachdem ich einen Stream von Midudev, einer meiner größten Inspirationen in der Webentwicklung, über einen Hackathon gesehen hatte, beschloss ich, zum ersten Mal an einem teilzunehmen.

Ich verbrachte ein paar Tage damit, darüber nachzudenken, was ich bauen sollte, und entschied mich schließlich für ein Tool, das für mich selbst nützlich wäre: eine Code-Zwischenablage in der Cloud.

Normalerweise programmiere ich zu Hause an meinem Hauptrechner oder in der Bibliothek mit einem Laptop, und manchmal möchte ich kleine Code-Schnipsel vorübergehend und schnell zwischen meinen Rechnern teilen, ohne auf GitHub zurückgreifen zu müssen.
Bisher habe ich Notion benutzt, aber es war nicht so bequem, wie ich es mir gewünscht hätte. Ich brauchte etwas, in das ich einfach reinspringen und einfügen kann, speziell auf Code ausgerichtet.

Es dauerte etwas länger als erwartet, und ich konnte nicht alle Funktionen hinzufügen, die ich mir vorgestellt hatte. Aber trotzdem war ich am Ende sehr zufrieden mit dem Ergebnis.'
WHERE slug = 'klipcode'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Ein Onlineshop, der auf Fernbedienungen für Fernseher und Streaminggeräte spezialisiert ist.',
  history_de = 'Monate nachdem ich EliteBara verlassen hatte, kam mir die Idee, Produkte im Großhandel einzukaufen und auf Wallapop zu verkaufen.

Im Juli 2024, nach einer mühsamen Suche nach Produkten und Lieferanten, beschloss ich, etwas gemischten Bestand zu bestellen, hauptsächlich Fernbedienungen für Fire TV.

Ein paar Tage nach dem Einstellen der Anzeigen kam mein erster Verkauf. Kurioserweise war es der 13. Juli 2024, genau ein Jahr nach der Geburt von EliteBara.

Über die Wochen kaufte ich weiter Bestand ein und verkaufte ihn, wobei ich die Preise anpasste, um die Rentabilität zu optimieren.

Mit der Zeit konzentrierte ich mich immer mehr auf Fernbedienungen. Das war am profitabelsten.

Alles lief gut und wuchs Monat für Monat, bis im Oktober mein erster Rückschlag kam: Mein Wallapop-Konto wurde gesperrt.

Anfangs machte ich mir keine großen Sorgen. Es war offensichtlich ein Fehler, und sie würden es sofort zurückgeben.

Ich schrieb ihnen, um sie darauf hinzuweisen, aber ihre Antwort war, dass es keinen Fehler gebe. Obwohl ihre Argumente keinen Sinn ergaben.

Ich blieb hartnäckig. Ablehnung um Ablehnung. Ich schickte Nachrichten, schaltete externe Organisationen ein, sogar einen Brief. Den einzigen echten Brief, den ich in meinem Leben geschickt habe. Ich dachte sogar daran, in ihren Büros in Barcelona aufzutauchen.

Nach zwei qualvollen Wochen, als alles verloren schien, drohte ich ihnen mit rechtlichen Schritten. Und dann, vielleicht erschöpft von meiner Hartnäckigkeit oder erschrocken über meinen Bluff (wahrscheinlich Ersteres), kam eine E-Mail: Sie räumten ein, einen Fehler gemacht zu haben, und gaben mir das Konto zurück. Ich hatte gewonnen.

Dieser Moment markierte ein Davor und ein Danach. Zunächst einmal konnte das nicht länger ein namenloses Projekt bleiben, das nur von Wallapop abhing.

Also wurde Octopus Control offiziell geboren. Ich begann, auf anderen Second-Hand-Plattformen zu verkaufen, und erstellte eine Website mit Shopify. Nicht lange nach dem Rebranding schaffte ich es, wieder auf das Einkommensniveau vor der Kontosperrung zu kommen.

Ein paar Monate später fing ich an, mir Gedanken über Steuern und rechtliche Dinge zu machen. Im Dezember brachte ich alles in Ordnung und meldete mich als Selbstständiger an.

Heute erwirtschaftet es weiterhin wiederkehrende Einnahmen, mit denen ich Ausgaben bezahlen und in andere Unternehmen investieren kann.

Kürzlich habe ich aufgehört, über die Website von Octopus Control zu verkaufen, und nutze sie nur noch als Katalog.'
WHERE slug = 'octopus-control'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Ein ERP, das auf Einfachheit und Bedienkomfort setzt.',
  history_de = 'Ich hatte es satt, die Buchhaltung von Octopus Control in einer riesigen Tabellenkalkulation zu führen, und beschloss, mit meinem neuen Programmierwissen dank RANKMAKER nach einer Alternative zu suchen.

Ich baute eine kleine Webanwendung, mit der ich alles tun konnte, was ich in meiner Tabelle gemacht hatte, nur viel bequemer und intuitiver.

Mehrere Monate lang nutzte ich sie als einfaches ERP für den Eigengebrauch.

Doch nachdem ich entdeckt hatte, dass PHP im Jahr 2026 vielleicht nicht der ratsamste Weg ist, schrieb ich es mit moderneren Web-Technologien neu, um es auf Cloudflare bereitstellen zu können.

Ich nutzte außerdem die Gelegenheit, den Quellcode der Anwendung auf GitHub zu veröffentlichen, falls er für jemand anderen so nützlich sein könnte wie für mich.

Erst ein Jahr nachdem ich angefangen hatte, es zu benutzen, entschied ich jedoch, dass dieses Tool ein eigenes Projekt sein könnte.

Also verpasste ich ihm eine komplette Runderneuerung und fügte APIs, Plugins, eine Landingpage und ein Login-System hinzu, damit jeder es nutzen kann, ohne mein Repository klonen zu müssen.'
WHERE slug = 'oliverp'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Eine Website, um Rankings zu verschiedenen Themen durch 1-gegen-1-Duelle zu erstellen.',
  history_de = 'An einem ganz gewöhnlichen Tag im Februar 2025, als ich mich nach einem Lauf zum Duschen fertigmachte, traf mich plötzlich eine zufällige Erinnerung.

Vor ein paar Jahren hatte ich ein Ranking von Formel-1-Fahrern gemacht, das jemand auf Twitter geteilt hatte.

Das System faszinierte mich; ich musste nicht von Anfang an über die genaue Reihenfolge nachdenken oder eine Tier-List erstellen.

Sie gaben mir einfach 1-gegen-1-Duelle, und aus meinen Entscheidungen entstand ein Ranking.

Damals maß ich dem keine große Bedeutung bei, aber aus irgendeinem Grund kam es mir in diesem Moment wieder in den Sinn.

Unter der Dusche dachte ich weiter darüber nach. Ich hatte keine Ahnung vom Programmieren, aber ich war besessen von KI.

Sobald ich aus der Dusche kam, öffnete ich ChatGPT, probierte ein bisschen herum, und in wenigen Minuten hatte ich ein einfaches System, in dem ich Optionen eingeben, sie in Duellen gegeneinander antreten lassen und ein geordnetes Ranking erhalten konnte.

Mir wurde klar, dass es keine Website gab, die genau das tat. Das war meine Chance. Ich konnte eine Woche damit verbringen und mich zur Abwechslung auch ein wenig von Octopus Control lösen.

Beim Teil mit der „Woche“ war ich zu optimistisch. Es war nicht so einfach, mit ChatGPT zu iterieren. Aber ich entdeckte leistungsfähigere Tools wie Cursor oder Trae.

Seit ich das Konzept von Datenbanken kennengelernt hatte, dachte ich, ich würde zuerst alles lokal zum Laufen bringen und es später mit einer Datenbank verbinden. Aber meine Vorstellung von „lokal funktionieren“ bestand darin, localStorage als Ersatz für eine Datenbank zu verwenden (ohne die geringste Ahnung, was ich da tat).

Als ich beschloss, den Sprung zu wagen und die Datenbank einzubauen, war es nicht so einfach, der KI zu sagen: „Verschiebe das von localStorage in eine Datenbank.“ Ich steckte wochenlang fest und probierte verschiedene Prompts und Strukturen ohne Erfolg aus. Ich hatte die Nase voll und fing von vorne an.

Diesmal wäre von Anfang an alles mit einer Datenbank verbunden, und ich würde PHP verwenden. Diesmal funktionierte es; ich schaffte es, mit der Datenbank zu interagieren.

Ich gestaltete alles neu. Es schien bereit für den öffentlichen Start, aber dann entdeckte ich einen kritischen Fehler: Die 1-gegen-1-Duelle funktionierten nicht richtig. Sie waren schlecht umgesetzt. Ich versuchte tausendmal, es zu beheben, ohne Erfolg.

Also fing ich wieder von vorn an. Diesmal mit besserer Dateiorganisation (ich hatte eine JavaScript-Datei mit 3000 Zeilen). Nach mehreren Versionen und weiteren Neustarts entschied ich mich für Astro und React (ohne viel Ahnung zu haben, wie sie funktionierten). Ich schloss die Version ab und bereitete mich darauf vor, sie auf das Hosting hochzuladen.

Aber als ich es tun wollte, entdeckte ich, dass mein Hosting zu einfach war: Es unterstützte nur PHP und kaum etwas anderes. Wieder von vorn.

Ich wusste jedoch schon, was ich tat (mehr oder weniger), und so hatte ich in wenigen Tagen eine weitere Version, diesmal wieder mit PHP. Viel einfacher, als ich es mir anfangs vorgestellt hatte, aber das Wesentliche war da.

Am 6. Juni 2025 wurde RANKMAKER schließlich geboren, nach fast einem halben Jahr voller Hingabe, in dem ich zu 100 % am Projekt arbeitete und Octopus Control völlig vernachlässigte.

In Wirklichkeit waren es 4 oder 5 Monate voller Tests, Blockaden und Neustarts, um am Ende alles in wenigen Tagen mit dem „richtigen“ Ansatz zu entwickeln.

Obwohl nach der Veröffentlichung gar nichts wie erwartet lief, nahm ich eine brutale Lernerfahrung mit, genau wie bei EliteBara.

Ich verstand immer noch nicht ganz genau, wie das, was ich gemacht hatte, funktionierte, aber die Konzepte, die ich lernte, waren entscheidend dafür, dass ich mich ein paar Monate später dafür interessierte, Webentwicklung und Programmieren auf herkömmliche Weise zu lernen.

Derzeit läuft RANKMAKER auf Astro, nachdem es Anfang 2026 von Grund auf neu aufgebaut wurde.'
WHERE slug = 'rankmaker'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Eine App, um Dateien und Text asynchron zwischen deinen Geräten zu teilen.',
  history_de = 'Seit ich meinen ersten Computer bekam und mehr als ein Gerät benutzte, hatte ich immer dasselbe Problem: Dateien und Text zwischen meinen eigenen Geräten zu teilen.

Ich habe Cloud-Dienste wie OneDrive benutzt, Tools, die genau dafür gedacht sind, wie Link to Windows oder Quick Share, und sogar E-Mail oder Notion, wenn ich nur Text teilen wollte.

Aber die Cloud fühlt sich für etwas so Simples mühsam an. Ich will nicht darüber nachdenken müssen, in welchem Ordner ich eine Datei speichere. Ich will sie einfach senden und fertig.

Dateien an mich selbst zu mailen mag schneller sein, ist aber immer noch keine ideale Lösung und füllt obendrein unnötig meinen Google-Drive-Speicher.

Diese Optionen haben noch ein weiteres Problem: Sie sind nicht vollständig privat. Meine Daten müssen auf den Servern von jemand anderem liegen.

Tools wie Link to Windows oder Quick Share scheinen eine bessere Alternative zu sein, da sie lokal arbeiten und genau dafür entworfen wurden. Beide Geräte gleichzeitig verbunden halten zu müssen, war jedoch nicht gerade bequem. Außerdem musste ich sie ständig neu verbinden, weil sie sich aus dem einen oder anderen Grund immer wieder trennten.

Also beschloss ich, dass ich lange genug gewartet hatte, und baute meine eigene Alternative um drei Kernideen herum:

- Extreme Bequemlichkeit und Geschwindigkeit, wie ein Chat mit sich selbst.
- Einmalige Einrichtung und asynchroner Betrieb. Ich möchte meine Sachen senden können, ohne das andere Gerät anzufassen oder mir Gedanken darüber zu machen, wo es ist.
- Privatsphäre. Natürlich brauchte ich Ende-zu-Ende-Verschlüsselung, wie bei Telegram oder WhatsApp.

Ich gab ihm den vorläufigen Namen file-sharer, und praktisch ab der ersten Minute, in der es funktionierte, wurde es eines meiner liebsten Projekte, die ich je gebaut hatte.

Mit der Zeit verbesserte ich es immer weiter, fügte neue Funktionen hinzu und stärkte seine Sicherheit. Schließlich benannte ich es in SendSelf um.'
WHERE slug = 'sendself'
  AND short_description_de IS NULL
  AND history_de IS NULL;

UPDATE projects SET
  short_description_de = 'Privater Verwalter für Video-Lesezeichen',
  history_de = 'Ich erinnere mich, dass sich einmal in der Schule ein Mitschüler wunderte, als er sah, dass ich die Funktion „Später ansehen“ von YouTube benutzte. Er sagte mir, ich sei die einzige Person, die er je gesehen habe, die sie nutzt.

Ich nutze sie bis heute und halte sie für unverzichtbar. Vielleicht bin ich wirklich der Einzige, der sie benutzt. Aber ich habe Vidshelf für mich selbst gebaut, also störte es mich nicht wirklich.

Neben der Möglichkeit, Inhalte von verschiedenen Plattformen an einem Ort zu speichern, war Vidshelf auch mein Einstieg in Projekte, die über einfache Websites hinausgingen.'
WHERE slug = 'vidshelf'
  AND short_description_de IS NULL
  AND history_de IS NULL;
