export function descendantCategoryIds(categories, id) {
  const found = new Set(), queue = [id];
  while (queue.length) {
    const current = queue.shift();
    for (const category of categories) if (category.parent_id === current && category.id !== id && !found.has(category.id)) { found.add(category.id); queue.push(category.id); }
  }
  return found;
}

export function categoryPath(categories, id) {
  const names = [], seen = new Set();
  let category = categories.find(item => item.id === id);
  while (category && !seen.has(category.id)) {
    seen.add(category.id); names.unshift(category.name);
    category = categories.find(item => item.id === category.parent_id);
  }
  return names.join(' / ');
}

export function categoryProductCount(categories, products, id) {
  const ids = descendantCategoryIds(categories, id); ids.add(id);
  return products.filter(product => ids.has(product.category_id)).length;
}
