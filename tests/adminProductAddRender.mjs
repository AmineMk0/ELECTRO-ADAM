import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const render = path => renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [path] }, React.createElement(App)));
  const html = render('/admin/products/add');
  assert.equal((html.match(/<form\b/g) || []).length, 1);
  for (const label of ['المعلومات الأساسية', 'صور المنتج', 'وصف المنتج (قائمة نقاط)', 'مواصفات المنتج', 'محتويات العلبة', 'حفظ المنتج', 'إعادة التعيين', 'إلغاء']) assert(html.includes(label), label);
  for (const name of ['name', 'reference', 'category_id', 'brand', 'price', 'promotional_price', 'stock', 'is_active']) assert(html.includes(`id="product-${name}"`), name);
  assert(html.includes('dir="rtl"')); assert(html.includes('type="file"')); assert(html.includes('multiple=""'));
  assert(html.includes('role="switch"')); assert(!html.includes('role="tab"')); assert(!html.includes('<details')); assert(!html.includes('<footer'));
  assert(!html.includes('aria-label="تواصل عبر واتساب"'));
  const parts = {};
  for (const path of ['/admin/dashboard', '/admin/orders', '/admin/products', '/admin/categories']) {
    const page = render(path);
    parts[path] = Object.fromEntries(['aside', 'header', 'main'].map(tag => [tag, page.match(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`))?.[0]]));
  }
  const newAside = html.match(/<aside\b[^>]*>[\s\S]*?<\/aside>/)[0];
  const newHeader = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)[0];
  assert.equal(newAside, parts['/admin/products'].aside); assert.equal(newHeader, parts['/admin/products'].header);
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(parts));
  console.log('Add Product SSR: one form, all sections/fields, RTL, protected Admin layout; identical Products header/sidebar.');
} finally { await server.close(); }
