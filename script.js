const burger = document.querySelector(".menuIcon");
const navList = document.querySelector(".navList");
const timelineButton = document.getElementById("timelineButton")
const backdrop = document.getElementById("timelineBackdrop");
const timelineCloseButton = document.getElementById("timelineCloseButton");
const panel = document.getElementById("mobileTimelinePanel");


const timelineScroll = document.getElementById("timelineRoot");

burger.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    burger.setAttribute("aria-expanded", isOpen);
});


function toggleTimeline() {
    const isOpen = document.body.classList.toggle("timelineOpen");
    timelineButton.classList.toggle("open", isOpen);
    document.documentElement.classList.toggle("timelineOpen", isOpen); // html

    if (isOpen && panel) {
        requestAnimationFrame(() => {
            panel.scrollTop = 0;
        });
    }
    if (isOpen && timelineScroll) {
        requestAnimationFrame(() => {
            timelineScroll.scrollTop = 0;
        });
    }
}

function closeTimeline() {
    document.body.classList.remove("timelineOpen");
    timelineButton.classList.remove("open");
    document.documentElement.classList.remove("timelineOpen"); // html auch sauber schließen

}

timelineButton.addEventListener("click", toggleTimeline);
backdrop.addEventListener("click", closeTimeline);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeTimeline();
});

timelineCloseButton.addEventListener("click", closeTimeline);





// ====== 1) Daten: nur Datum + Ort/Titel + optional SoundCloud href ======
const gigs = [
    { date: "2025-10-01", title: "Time", href: "https://on.soundcloud.com/JVDrCksc0UmujuCisM" },
    { date: "2025-10-01", title: "Awaken", href: "https://on.soundcloud.com/wXYEOKXcJOpfeQUwWG" },
    { date: "2025-05-01", title: "Simultaneous Vibe", href: "https://on.soundcloud.com/mFXrK2n6O800WROt5p" },
    { date: "2026-09-26", title: "Private Hochzeit" },
    { date: "2026-06-13", title: "Private Hochzeit" },
    { date: "2026-02-07", title: "Palais, Munich" },
    { date: "2026-01-24", title: "Korajo Winter Afterall, Munich" },
    { date: "2026-01-23", title: "Zur Gruam, Munich" },

    { date: "2025-10-03", title: "Bahnwärther Thiel, Munich" },

    {
        date: "2025-09-05",
        title: "Festival am Waldrand, Pforzheim",
        href: "https://soundcloud.com/moritzminoa/moritz-minoa-kuckucksnest-festival-am-waldrand-2025-09-119-133-bpm",
    },
    {
        date: "2025-08-05",
        title: "Bucht der Träumer* Festival, Helenesee",
        href: "https://soundcloud.com/moritzminoa/oniva-b2b-moritz-minoa-bucht-der-traumer-2025",
    },

    { date: "2025-08-09", title: "Süss. War Gestern, Berlin" },
    { date: "2025-07-05", title: "Legal, Munich" },
    { date: "2025-07-04", title: "Palais Club. Munich" },
    { date: "2025-06-21", title: "Zur Grua, Munich" },
    { date: "2025-05-30", title: "Zur Gruam, Munich" },
    { date: "2025-04-29", title: "Süss. War Gestern, Berlin" },
    { date: "2025-03-22", title: "Forsthaus, Starnberg", href: "https://soundcloud.com/moritzminoa/2025-03-22-moritz-minoa-forsthaus" },
    { date: "2025-02-07", title: "Lieberscholli, Munich", href: "https://soundcloud.com/moritzminoa/2025-03-07-luis-m" },
];

// ====== 2) Helpers ======
const MONTHS_DE = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sept", "Okt", "Nov", "Dez"];

const MONTHS_ENG = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    d.setHours(0, 0, 0, 0);
    return d;
}

function todayDate() {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
}

function getYear(dateStr) {
    return toDate(dateStr).getFullYear();
}

function formatLabel(dateStr, isFutureOrNext) {
    const d = toDate(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = MONTHS_ENG[d.getMonth()];
    const year = d.getFullYear();

    if (isFutureOrNext) return `${day}. ${month} ${year}`;
    return `${month} ${year}`;
}

function soundcloudIconSvg() {
    return `
    <svg class="icon soundcloudIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M11.56,8.87V17H20.32V17C22.17,16.87 23,15.73 23,14.33C23,12.85 21.88,11.66 20.38,11.66C20,11.66 19.68,11.74 19.35,11.88C19.11,9.54 17.12,7.71 14.67,7.71C13.5,7.71 12.39,8.15 11.56,8.87M10.68,9.89C10.38,9.71 10.06,9.57 9.71,9.5V17H11.1V9.34C10.95,9.5 10.81,9.7 10.68,9.89M8.33,9.35V17H9.25V9.38C9.06,9.35 8.87,9.34 8.67,9.34C8.55,9.34 8.44,9.34 8.33,9.35M6.5,10V17H7.41V9.54C7.08,9.65 6.77,9.81 6.5,10M4.83,12.5C4.77,12.5 4.71,12.44 4.64,12.41V17H5.56V10.86C5.19,11.34 4.94,11.91 4.83,12.5M2.79,12.22V16.91C3,16.97 3.24,17 3.5,17H3.72V12.14C3.64,12.13 3.56,12.12 3.5,12.12C3.24,12.12 3,12.16 2.79,12.22M1,14.56C1,15.31 1.34,15.97 1.87,16.42V12.71C1.34,13.15 1,13.82 1,14.56Z"/>
    </svg>
  `;
}

// ====== 3) Logik: past/future + exakt ein "next" (nächster Gig ab heute) ======
function normalizeAndSort(items) {
    // Defensive Copy + Sort asc by date
    return [...items].sort((a, b) => toDate(a.date) - toDate(b.date));
}

function computeClasses(sortedItems) {
    const t = todayDate();

    // Index des nächsten Gigs: erstes Event mit date >= heute
    const nextIndex = sortedItems.findIndex((g) => toDate(g.date) >= t);

    return sortedItems.map((gig, idx) => {
        const d = toDate(gig.date);

        let kind = "future";
        if (d < t) kind = "past";

        // Wenn es überhaupt einen kommenden gibt, genau dieser ist "next"
        if (nextIndex !== -1 && idx === nextIndex) kind = "next";

        return { ...gig, kind };
    });
}

// ====== 4) Sortierung fürs Rendern: Future/Next oben, Past unten ======
function sortForRender(itemsWithKind) {
    const next = itemsWithKind
        .filter((g) => g.kind === "next")
        .sort((a, b) => toDate(a.date) - toDate(b.date)); // theoretisch nur 1 element

    const future = itemsWithKind
        .filter((g) => g.kind === "future")
        .sort((a, b) => toDate(b.date) - toDate(a.date)); // wichtig: absteigend (fernste zuerst)

    const past = itemsWithKind
        .filter((g) => g.kind === "past")
        .sort((a, b) => toDate(b.date) - toDate(a.date)); // neuestes zuerst

    return [...future, ...next, ...past];
}

// ====== 5) Renderer ======
function renderTimeline(rawItems, rootEl) {
    if (!rootEl) return;

    const sortedAsc = normalizeAndSort(rawItems);
    const withKind = computeClasses(sortedAsc);
    const data = sortForRender(withKind);

    const frag = document.createDocumentFragment();

    const line = document.createElement("div");
    line.className = "timeline-line";
    frag.appendChild(line);

    let lastPastYear = null;
    let nextLabelInserted = false;

    data.forEach((gig) => {
        // Year label nur für Past, wenn neues Jahr beginnt (im Past-Block)
        if (gig.kind === "next" && !nextLabelInserted) {
            const nextEl = document.createElement("div");
            nextEl.className = "timeline-nextLabel";
            nextEl.textContent = "Next";
            frag.appendChild(nextEl);
            nextLabelInserted = true;
        }
        if (gig.kind === "past") {
            const year = getYear(gig.date);
            if (year !== lastPastYear) {
                const yearEl = document.createElement("div");
                yearEl.className = "timeline-year";
                yearEl.textContent = String(year);
                frag.appendChild(yearEl);
                lastPastYear = year;
            }
        }

        const item = document.createElement("div");
        item.className = `timeline-item ${gig.kind}`;

        const time = document.createElement("time");
        time.dateTime = gig.date;
        time.textContent = formatLabel(gig.date, gig.kind === "future" || gig.kind === "next");
        item.appendChild(time);

        // Content:
        // Wenn href vorhanden: immer SoundCloud, Text + SVG orange
        if (gig.href) {
            const wrap = document.createElement("div");
            wrap.className = "soundcloudOnline";

            const a = document.createElement("a");
            a.className = "timeline-link timeline-link--soundcloud";
            a.href = gig.href;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = gig.title;

            const iconLink = document.createElement("a");
            iconLink.href = gig.href;
            iconLink.target = "_blank";
            iconLink.rel = "noopener noreferrer";
            iconLink.className = "soundcloudIcon";
            iconLink.innerHTML = soundcloudIconSvg();

            wrap.appendChild(a);
            wrap.appendChild(iconLink);
            item.appendChild(wrap);
        } else {
            const span = document.createElement("span");
            span.textContent = gig.title;
            item.appendChild(span);
        }

        frag.appendChild(item);
    });

    rootEl.innerHTML = "";
    rootEl.appendChild(frag);
}

// ====== 6) Boot ======
document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("timelineRoot");
    renderTimeline(gigs, root);
});

