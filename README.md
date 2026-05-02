<h1>Testare unitară în JavaScript (Vitest, React Testing Library)</h1>

<b> 1. Aplicație de comandat mâncare</b>

Am dezvoltat o suită de teste pentru o aplicație simplă de comandat mâncare. Utilizatorii au la dispoziție cca 20 de feluri (Anexa 1) pe care le pot adăuga în coș (Anexa 2). De acolo pot plasa o comandă (Anexa 3), introducând date de livrare (nu există modul de plată). La final, dacă comanda a fost înregistrată cu succes, primesc un mesaj pozitiv și sunt redirecționați către homepage (Anexa 4).
Backend-ul a fost implementat în Node.js, folosind Express 4.18.2 pentru expunerea unui API REST. REST (Representational State Transfer) este un stil arhitectural pentru sistemele distribuite, definit de Roy Fielding în teza sa de doctorat din 2000, care descrie un set de constrângeri ce permit scalabilitatea și interoperabilitatea serviciilor web [1]. Un API REST folosește metode HTTP standard (GET, POST, PUT, DELETE) pentru a opera asupra resurselor identificate prin URL-uri, menținând comunicarea fără stare (stateless) între client și server. Felurile de mâncare au fost stocate în format JSON în fișierul 'available-meals.json', fiecare fel de mâncare având următoarele proprietăți: id, nume, preț, descriere și calea către o imagine stocată în folderul 'images'. Imaginile au fost generate cu AI [2]. La apelarea căii GET/meals se cere lista felurilor. Postarea comenzilor se face tot într-un fișier JSON, orders.JSON, apelând calea POST/orders și realizând o serie de validări server-side pentru formularul de checkout.
Frontend-ul aplicației a fost dezvoltat folosind React 19.0.0 și React DOM 19.0.0, iar mediul de dezvoltare și build-ul au fost gestionate cu Vite 4.4.5 și pluginul @vitejs/plugin-react 4.0.3. Comunicarea cu backend-ul se face prin Axios 1.15.1. React este o bibliotecă JavaScript open-source, dezvoltată de Meta, destinată construirii interfețelor utilizator prin componente reutilizabile [3]. Fiecare componentă înglobează propria logică și stare, iar React utilizează un DOM virtual (Virtual DOM) pentru a recalcula eficient diferențele față de DOM-ul real și a minimiza numărul de actualizări costisitoare ale interfeței. Vite este un instrument modern de build pentru aplicații web front-end, creat de Evan You [4]. Spre deosebire de bundlerele tradiționale, Vite servește codul sursă ca module ES native în browser în faza de dezvoltare, eliminând necesitatea unui pas complet de bundling și reducând semnificativ timpii de pornire ai serverului de dezvoltare. Pentru producție, Vite utilizează Rollup pentru a genera fișiere optimizate și compacte. Aplicația este randată în fișierul main.jsx, unde s-a folosit modul Strict pentru a preveni erorile. Specific unei aplicații React s-au utilizat componente, salvate în folderul 'components'. S-a optat pentru utilizarea unui context, care să stocheze felurile de mâncare disponibile și coșul curent și să expună tuturor componentelor metode de adăugare a produselor în coș, de ajustare a cantității și de plasare a comenzii. Felurile de mâncare sunt randate dinamic prin componenta 'meals.jsx' și 'meal.jsx'. Coșul, respectiv formularul de checkout și mesajul de după plasarea comenzii au fost realizate printr-o componentă dinamică de tip modal care a fost injectată în headerul fișierului.

Pentru a rula aplicația este nevoie de două terminale deschise simultan și se poate realiza folosind următoarele instrucțiuni:
Terminal 1 -  backend
cd backend
npm install
npm start

Terminal 2 - frontend
npm install
npm run dev

<b>2. Strategii și principii de testare </b>

În dezvoltarea software modernă, testele sunt organizate pe trei niveluri principale, descrise prin modelul „piramidei testelor" [5].
Testele unitare (unit tests) vizează verificarea comportamentului corect al celor mai mici unități de cod — funcții sau componente — în izolare față de restul sistemului. Dependențele externe sunt simulate prin mock-uri sau stub-uri, ceea ce face ca testele unitare să fie rapide, ușor de întreținut și ușor de localizat în caz de eșec [6]. Testele de integrare (integration tests) verifică interacțiunea corectă dintre mai multe unități sau module ale aplicației. Spre deosebire de testele unitare, acestea nu izolează dependențele, ci testează comportamentul unui ansamblu de componente care colaborează — de exemplu, o componentă React care comunică cu un context sau cu un serviciu extern. Testele end-to-end (E2E tests) simulează comportamentul unui utilizator real, parcurgând fluxuri complete ale aplicației de la interfața utilizator până la persistarea datelor. Acestea oferă cel mai mare grad de încredere în funcționarea aplicației ca întreg, dar sunt și cele mai lente și mai fragile dintre cele trei categorii.
În cadrul acestui proiect, strategia de testare a urmărit acoperirea tuturor celor trei niveluri, cu scopul de a obține o suită cât mai diversă de teste. Au fost testate: validările formularului de checkout, comportamentul butoanelor de ajustare a cantității din coș, randarea corectă a componentelor și fluxuri complete de utilizare a aplicației.
Un alt principiu folosit a fost cel al celor trei A: Arrange, Act și Assert. La începutul testului se creează contextul pentru ce se dorește a se testa, apoi are loc o acțiune, cel mai adesea un click, iar la final se fac una sau mai multe aserțiuni pentru a stabili dacă rezultatul primit corespunde cu cel așteptat. S-au testat atât cazurile favorabile, cât și cele nefavorabile.

<b>3. Frameworkuri de testare: Vitest, React Testing Library, Playwright </b>

Inițial s-a luat în considerare utilizarea Jest, framework-ul de testare cel mai răspândit în ecosistemul JavaScript. Totuși, pentru un proiect bazat pe Vite, Vitest reprezintă alegerea mai potrivită: partajează aceeași configurație cu Vite (vite.config.js), suportă nativ ES modules fără transformări suplimentare și oferă timpi de rulare semnificativ mai mici [7]. Vitest expune un API compatibil cu Jest (describe, it/test, expect), ceea ce face tranziția intuitivă. Versiunea utilizată: vitest 4.1.5, @vitest/ui 4.1.5, @vitest/browser-playwright 4.1.5.
React Testing Library (RTL) este o bibliotecă de utilități pentru testarea componentelor React, construită pe principiul că testele ar trebui să verifice comportamentul vizibil utilizatorului, nu detaliile de implementare internă ale componentelor [8]. RTL interacționează cu DOM-ul redat, permițând simularea acțiunilor reale prin @testing-library/user-event. Versiunile utilizate: @testing-library/react 16.3.2, @testing-library/dom 10.4.1, @testing-library/jest-dom 6.9.1, @testing-library/user-event 14.6.1.
Configurația Vitest este integrată direct în vite.config.js, în câmpul test:
- globals: true — funcțiile de test (describe, it, expect) sunt disponibile global, fără import explicit în fiecare fișier
- environment: 'jsdom' — testele rulează într-o mașină virtuală jsdom (versiunea 22.1.0), care simulează un browser în mediul Node.js, permițând randarea și interacțiunea cu componente React fără a necesita un browser real
- setupFiles: "./src/setupTests.js" — fișier de inițializare rulat înaintea fiecărui suite de teste
- restoreMocks: true — mock-urile sunt restaurate automat după fiecare test, prevenind contaminarea între teste
- include/exclude — testele Vitest acoperă fișierele din src/, iar directorul e2e/ este exclus explicit, deoarece testele end-to-end sunt gestionate separat de Playwright
- browser.enabled: false — modul browser (care rulează testele într-un Chromium real via Playwright) este dezactivat implicit; poate fi activat prin configurația separată vitest.browser.config.js
Playwright [9] este un framework de testare E2E care automatizează interacțiunea cu browserul. Configurația din playwright.config.js definește:
- testDir: './e2e' — toate testele E2E se găsesc în directorul e2e/
- timeout: 30 000 ms per test; expect.timeout: 5 000 ms per aserție
- baseURL: 'http://127.0.0.1:4173' — URL-ul frontend-ului în modul preview (vite preview)
- trace: 'on-first-retry' — la primul retry al unui test eșuat se înregistrează un trace complet (rețea, screenshot-uri, DOM) pentru debugging
- projects: chromium — testele rulează pe Desktop Chrome via Chromium
- webServer — Playwright pornește automat ambele servere înainte de rularea testelor: backend-ul pe portul 3000 și frontend-ul pe portul 4173, reutilizând serverele deja pornite dacă există (reuseExistingServer: true).

Testele create s-au realizat după un plan (Anexa 5) care a urmărit să pornească de la funcțiile ajutătoare din fișierul 'helper-functions.txt' și de la componentele cele mai mici, Input și Submit. Apoi, randarea produselor în pagină a fost mock-uită pentru a se testa acest comportament independent de backend; la fel și pentru metoda de adăugare în coș.
Ulterior, la testele de integrare s-a urmărit ca modalul să apară în pagină și să se deschidă / închidă corect. Pentru componenta de checkout s-a verificat apariția fiecărei erori în particular la validarea formularului. Metodele din context au fost mock-uite din nou pentru a-l testa împreună cu coșul de cumpărături, produsele să poată fi adăugate în coș, iar cantitatea să poată fi modificată corespunzător. Aceste teste rulate cu vitest (npm run test) se găsesc în 8 fișiere în folderul './tests' (Anexa 6). Conform configurării vitest, înainte de acestea se rulează mereu fișierul 'setupTests.js', având menirea de a adăuga și îndepărta modalul înainte și după rularea fiecărui test.
Separat, în folderul e2e se regăsesc testele rulate cu playwright (npm run test:e2e). În cazul acestora, s-a urmărit să nu mai fie mock-uite metodele care comunică cu backend-ul, de aducere a produselor și postare a comenzilor (Anexa 7).

<b>4. Raport despre folosirea AI-ului</b>
Am utilizat tool-ul AI Github Copilot, pentru testele repetitive. Spre exemplu, în suita de teste 'Checkout.test.jsx' se testează funcționarea validărilor formularului. După ce am creat testul "name filled => username error dissapears" și "email filled => email error dissapears" am scris un prompt în care am solicitat crearea unui test similar pentru câmpul număr poștal.
O altă utilizare a fost la testul butoanelor de increase și decrease din modal. După ce am realizat testul pentru decrease, urmărind și schimbarea stării modalului, am scris un prompt pentru replicarea acestui test pentru cazul increase. Diferența adusă de AI a fost o verificare mai riguroasă, nu a verificat doar prezența textului 'fasole bătută', ci și a prețului 1 x $20.0.

<b> (Referințe) </b>
[1]. Fielding, Roy T., "Architectural Styles and the Design of Network-based Software Architectures," Doctoral dissertation, University of California, Irvine, 2000, https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.html.
[2]. OpenAI, ChatGPT, https://chatgpt.com/, Prompt: "Generează câte o imagine pentru fiecare fel de mâncare din fișierul JSON available-meals.json atașat", Data generării: 27 aprilie 2026.
[3]. Meta Open Source, "React – A JavaScript library for building user interfaces," React documentation, https://react.dev/, Accesat: mai 2026.
[4]. You, Evan et al., "Vite – Next Generation Frontend Tooling," Vite documentation, https://vite.dev/, Accesat: aprilie 2026.
[5]. Fowler, Martin, "TestPyramid," martinfowler.com, 2012, https://martinfowler.com/bliki/TestPyramid.html, Accesat: aprilie 2026.
[6]. Osherove, Roy, "The Art of Unit Testing: with Examples in .NET," Manning Publications, 2009.
[7]. Vitest Team, "Vitest – A Vite-native testing framework," Vitest documentation, https://vitest.dev/, Accesat: aprilie 2026.
[8]. Testing Library, "React Testing Library," https://testing-library.com/docs/react-testing-library/intro/, Accesat: aprilie 2026.
[9]. Microsoft et al., "Playwright – Fast and reliable end-to-end testing for modern web apps," https://playwright.dev/, Accesat: aprilie 2026.

<b>(Anexe) </b> 
[1]. './anexe/homescreen.png'
[2]. './anexe/cos.png'
[3]. './anexe/checkout.png'
[4]. './anexe/comanda.png'
[5]. './plan_testare.txt'
[6]. './anexe/succes_vitest.png'
[7]. './anexe/succes_playwright.png'
