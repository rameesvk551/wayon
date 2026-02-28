/**
 * PDF Generator — Handlebars + Puppeteer PDF generation.
 * Converted from pdf-service pdf-generator.ts — all logic identical.
 *
 * Note: Templates must be placed in server/src/modules/pdf/templates/ (*.hbs)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");

import { PdfMapEmbedder } from "../helpers/pdf-map-embedder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(__dirname, "..", "templates");
const mapEmbedder = new PdfMapEmbedder();

/* ═══ CATEGORY ICON SYSTEM ═══ */

const CATEGORY_ICONS = {
    beach: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M17.5 8c2.5 0 4.5 2 4.5 4.5S20 17 17.5 17H2"/><path d="M13 12c0-3-2.5-5-5.5-5"/><path d="M2 19h18.5c1.4 0 2.5 1 2.5 2.5"/><line x1="2" y1="22" x2="22" y2="22"/></svg>',
    water: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M2 12h2c1.1 0 2-.9 2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2"/><path d="M14 12h2c1.1 0 2-.9 2-2s.9-2 2-2"/><path d="M2 17h2c1.1 0 2-.9 2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2"/><path d="M14 17h2c1.1 0 2-.9 2-2s.9-2 2-2"/></svg>',
    "water-sports": '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M2 12h2c1.1 0 2-.9 2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2"/><path d="M14 12h2c1.1 0 2-.9 2-2s.9-2 2-2"/><circle cx="12" cy="6" r="2"/><path d="M12 8v4"/></svg>',
    adventure: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M8 3l4 8 5-5 5 15H2L8 3z"/></svg>',
    cultural: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    heritage: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/></svg>',
    food: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    dining: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    nature: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M17 8C17 12.4183 13.4183 16 9 16"/><path d="M9 16c0-4.4183 3.5817-8 8-8"/><line x1="9" y1="16" x2="9" y2="22"/><path d="M7 20c2-2 5-2 7 0"/></svg>',
    shopping: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
    nightlife: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M8 22h8"/><line x1="12" y1="17" x2="12" y2="22"/><path d="M17 2l-5 9-5-9"/><path d="M2 11h20l-3.5-7"/></svg>',
    wellness: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 22c-4-3-8-6-8-10a4 4 0 018 0 4 4 0 018 0c0 4-4 7-8 10z"/></svg>',
    spa: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 22c-4-3-8-6-8-10a4 4 0 018 0 4 4 0 018 0c0 4-4 7-8 10z"/></svg>',
    sightseeing: '<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    photography: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    transport: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M14 16H9m10-6H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2z"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>',
    worship: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>',
    relaxation: '<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    default: '<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
};

const CATEGORY_COLORS = {
    beach: { bg: "#f0f9ff", color: "#0284c7" },
    water: { bg: "#f0f9ff", color: "#0284c7" },
    "water-sports": { bg: "#ecfeff", color: "#0891b2" },
    adventure: { bg: "#fef3c7", color: "#d97706" },
    cultural: { bg: "#f5f3ff", color: "#7c3aed" },
    heritage: { bg: "#fdf4ff", color: "#a855f7" },
    food: { bg: "#fff7ed", color: "#ea580c" },
    dining: { bg: "#fff7ed", color: "#ea580c" },
    nature: { bg: "#ecfdf5", color: "#059669" },
    shopping: { bg: "#fdf2f8", color: "#db2777" },
    nightlife: { bg: "#faf5ff", color: "#9333ea" },
    wellness: { bg: "#f0fdf4", color: "#16a34a" },
    spa: { bg: "#f0fdf4", color: "#16a34a" },
    sightseeing: { bg: "#eff6ff", color: "#2563eb" },
    photography: { bg: "#eff6ff", color: "#2563eb" },
    transport: { bg: "#f1f5f9", color: "#475569" },
    worship: { bg: "#fefce8", color: "#ca8a04" },
    relaxation: { bg: "#ecfdf5", color: "#059669" },
    default: { bg: "#eff6ff", color: "#2563eb" },
};

const getCategoryKey = (category) => {
    if (!category) return "default";
    const key = category.toLowerCase().replace(/[^a-z-]/g, "");
    return CATEGORY_ICONS[key] ? key : "default";
};

/* ═══ HANDLEBARS HELPERS ═══ */

let helpersRegistered = false;

const registerHelpers = () => {
    if (helpersRegistered) return;
    helpersRegistered = true;

    Handlebars.registerHelper("categoryIconSvg", (category) => new Handlebars.SafeString(CATEGORY_ICONS[getCategoryKey(category)] || CATEGORY_ICONS.default));
    Handlebars.registerHelper("categoryBg", (category) => (CATEGORY_COLORS[getCategoryKey(category)] || CATEGORY_COLORS.default).bg);
    Handlebars.registerHelper("categoryColor", (category) => (CATEGORY_COLORS[getCategoryKey(category)] || CATEGORY_COLORS.default).color);
    Handlebars.registerHelper("formatPrice", (price) => { if (!price && price !== 0) return ""; return price >= 1000 ? `₹${(price / 1000).toFixed(1)}k` : `₹${price}`; });
    Handlebars.registerHelper("starRating", (rating) => {
        if (!rating) return "";
        const full = Math.floor(rating); const half = rating % 1 >= 0.5 ? 1 : 0; const empty = 5 - full - half;
        let html = "";
        for (let i = 0; i < full; i++) html += '<span class="star">&#9733;</span>';
        for (let i = 0; i < half; i++) html += '<span class="star" style="opacity: 0.5;">&#9733;</span>';
        for (let i = 0; i < empty; i++) html += '<span class="star" style="opacity: 0.2;">&#9733;</span>';
        return new Handlebars.SafeString(html);
    });
    Handlebars.registerHelper("eq", function (a, b, options) { if (options && options.fn) return a === b ? options.fn(this) : options.inverse(this); return a === b; });
    Handlebars.registerHelper("lte", (a, b) => a <= b);
    Handlebars.registerHelper("gt", (a, b) => a > b);
    Handlebars.registerHelper("progressDots", function (totalDays, currentDay) {
        let html = "";
        for (let i = 1; i <= totalDays; i++) { const bg = i === currentDay ? "var(--brand-500)" : i < currentDay ? "var(--brand-200)" : "var(--bg-muted)"; html += `<div style="flex: 1; height: 4px; border-radius: 2px; background: ${bg};"></div>`; }
        return new Handlebars.SafeString(html);
    });
    Handlebars.registerHelper("times", function (n, options) { let result = ""; for (let i = 1; i <= n; i++) result += options.fn(i); return result; });
};

/* ═══ LEADER LINE COMPUTATION ═══ */

const computeLeaderLines = (leftCount, rightCount, accentColor) => {
    const lines = [];
    const mapLeftX = 48, mapRightX = 552, mapTop = 30, mapHeight = 420;
    for (let i = 0; i < Math.min(leftCount, 6); i++) {
        const cardY = 40 + i * (mapHeight / Math.max(leftCount, 1));
        const mapY = mapTop + ((i + 0.5) / Math.max(leftCount, 1)) * mapHeight;
        lines.push({ path: `M 0 ${cardY} C 20 ${cardY} ${mapLeftX - 20} ${mapY} ${mapLeftX} ${mapY}`, color: accentColor, endX: mapLeftX, endY: mapY });
    }
    for (let i = 0; i < Math.min(rightCount, 6); i++) {
        const cardY = 40 + i * (mapHeight / Math.max(rightCount, 1));
        const mapY = mapTop + ((i + 0.5) / Math.max(rightCount, 1)) * mapHeight;
        lines.push({ path: `M 600 ${cardY} C 580 ${cardY} ${mapRightX + 20} ${mapY} ${mapRightX} ${mapY}`, color: accentColor, endX: mapRightX, endY: mapY });
    }
    return lines;
};

/* ═══ CATEGORY TAGS ═══ */

const CATEGORY_EMOJI = {
    beach: "🏖️", water: "🌊", "water-sports": "🏄", adventure: "⛰️",
    cultural: "🏛️", heritage: "⛪", food: "🍽️", dining: "🍳",
    nature: "🌿", shopping: "🛍️", nightlife: "🍸", wellness: "🧘",
    spa: "💆", sightseeing: "📸", photography: "📷", transport: "🚗",
    worship: "⭐", relaxation: "😌",
};

const buildCategoryTags = (days) => {
    const seen = new Set();
    const tags = [];
    for (const day of days) {
        for (const act of day.activities) {
            if (!act.category) continue;
            const key = getCategoryKey(act.category);
            if (seen.has(key) || key === "default") continue;
            seen.add(key);
            tags.push({ label: act.category.charAt(0).toUpperCase() + act.category.slice(1), icon: CATEGORY_EMOJI[key] || "📍" });
        }
    }
    return tags.slice(0, 6);
};

/* ═══ TEMPLATE REGISTRATION ═══ */

const registerPartials = async () => {
    const coverTemplate = await fs.readFile(path.join(templatesDir, "infographic.hbs"), "utf-8");
    const dayTemplate = await fs.readFile(path.join(templatesDir, "day-page.hbs"), "utf-8");
    const mapOverviewTemplate = await fs.readFile(path.join(templatesDir, "map-overview.hbs"), "utf-8");
    Handlebars.registerPartial("infographic", coverTemplate);
    Handlebars.registerPartial("dayPage", dayTemplate);
    Handlebars.registerPartial("mapOverview", mapOverviewTemplate);
};

const getBaseTemplate = async () => fs.readFile(path.join(templatesDir, "base.hbs"), "utf-8");

const chunkMarkers = (markers) => {
    const left = [], right = [];
    markers.forEach((m, i) => (i % 2 === 0 ? left : right).push(m));
    return { left, right };
};

const buildRenderData = async (payload) => {
    const mapSections = await mapEmbedder.build(payload);
    const { left, right } = chunkMarkers(mapSections.markers);
    const accentColor = payload.branding?.accentColor || "#0ea5e9";
    const leaderLines = computeLeaderLines(left.length, right.length, accentColor);
    const categoryTags = buildCategoryTags(payload.days);

    return {
        ...payload,
        mapImage: mapSections.mapImage,
        overviewMapImage: mapSections.overviewMapImage,
        mapEnhancementsEnabled: mapSections.enabled,
        dayLegend: mapSections.dayLegend,
        distanceSummaryRows: mapSections.distanceSummaryRows,
        clusterSummaryRows: mapSections.clusterSummaryRows,
        days: mapSections.days,
        leftMarkers: left,
        rightMarkers: right,
        totalMarkerCount: mapSections.markers.length,
        leaderLines,
        categoryTags,
        branding: {
            logoUrl: payload.branding?.logoUrl,
            primaryColor: payload.branding?.primaryColor || "#1d4ed8",
            accentColor,
        },
    };
};

const countPages = async (pdfBuffer) => {
    try { const doc = await PDFDocument.load(pdfBuffer); return doc.getPageCount(); } catch { return 0; }
};

export const generateItineraryPdf = async (payload) => {
    const totalStartMs = Date.now();
    console.log(`📄 [PDF-GEN] Starting PDF generation for "${payload.trip.destination}"`);
    console.log(`   ├─ Days: ${payload.days.length}, Markers: ${payload.map.markers.length}, Format: ${payload.output.format}`);
    console.log(`   ├─ Cover page: ${payload.output.includeInfographicCover ? "yes" : "no"}`);
    console.log(`   └─ Activities: ${payload.days.map(d => `Day${d.dayNumber}=${d.activities.length}`).join(", ")}`);

    let stepMs = Date.now();
    registerHelpers();
    await registerPartials();
    console.log(`   [1/5] ✅ Helpers & partials registered (${Date.now() - stepMs}ms)`);

    stepMs = Date.now();
    const baseTemplate = await getBaseTemplate();
    const template = Handlebars.compile(baseTemplate);
    console.log(`   [2/5] ✅ Template compiled (${Date.now() - stepMs}ms)`);

    stepMs = Date.now();
    const renderData = await buildRenderData(payload);
    const mapFetchMs = Date.now() - stepMs;
    console.log(`   [3/5] ✅ Render data built (${mapFetchMs}ms)`);

    stepMs = Date.now();
    const html = template(renderData);
    console.log(`   [4/5] ✅ HTML rendered (${Date.now() - stepMs}ms, ${Math.round(html.length / 1024)}KB)`);

    stepMs = Date.now();
    console.log(`   [5/5] 🚀 Launching Puppeteer...`);
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--font-render-hinting=none", "--disable-gpu", "--force-color-profile=srgb"],
    });
    const launchMs = Date.now() - stepMs;

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

    stepMs = Date.now();
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });
    const setContentMs = Date.now() - stepMs;

    await page.evaluate(() => document.fonts?.ready);

    stepMs = Date.now();
    const pdfUint8 = await page.pdf({
        format: payload.output.format,
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
    });
    const pdfBuffer = Buffer.isBuffer(pdfUint8) ? pdfUint8 : Buffer.from(pdfUint8);
    const pdfRenderMs = Date.now() - stepMs;

    await browser.close();

    const pageCount = await countPages(pdfBuffer);
    const totalMs = Date.now() - totalStartMs;
    console.log(`   📄 PDF COMPLETE: ${pageCount} pages, ${Math.round(pdfBuffer.length / 1024)}KB, ${totalMs}ms total`);

    return { pdfBuffer, pageCount };
};

export const generateInteractiveHtml = async (payload) => {
    registerHelpers();
    await registerPartials();
    const interactiveTemplateSrc = await fs.readFile(path.join(templatesDir, "interactive.hbs"), "utf-8");
    const template = Handlebars.compile(interactiveTemplateSrc);
    const renderData = await buildRenderData(payload);
    return template(renderData);
};
