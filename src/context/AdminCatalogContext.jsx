import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createProductsDemo } from '../data/admin/productsDemo';
import { createCategoriesDemo, productCategoryOptions } from '../data/admin/categoriesDemo';
import { deleteDemoProduct, saveDemoProduct, validateImageFiles } from '../utils/adminProducts';
import { deleteDemoCategory, saveDemoCategory } from '../utils/adminCategories';
import { saveFullDemoProduct } from '../utils/adminProductCreate';

const AdminCatalogContext = createContext(null);

// A temporary shared catalogue for Admin routes only. No public catalogue or persistence.
export function AdminCatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(() => ({ products: createProductsDemo(), categories: createCategoriesDemo() }));
  const current = useRef(catalog), uploads = useRef(new Set()), sequence = useRef(0);
  const location = useLocation();
  function commit(next) { current.current = next; setCatalog(next); }
  function discardUnusedUploads() {
    const used = new Set([
      ...current.current.products.flatMap(product => product.images.filter(image => image.kind === 'upload').map(image => image.url)),
      ...current.current.categories.filter(category => category.image.kind === 'upload').map(category => category.image.url),
    ]);
    for (const url of uploads.current) if (!used.has(url)) { URL.revokeObjectURL(url); uploads.current.delete(url); }
  }
  useEffect(discardUnusedUploads, [location.pathname]);
  useEffect(() => () => { for (const url of uploads.current) URL.revokeObjectURL(url); uploads.current.clear(); }, []);
  function uploadImages(files, existingCount = 0) {
    validateImageFiles(files, existingCount);
    const created = [];
    try {
      return files.map(file => {
        const url = URL.createObjectURL(file); uploads.current.add(url); created.push(url);
        return { id: `upload-${Date.now()}-${sequence.current++}`, kind: 'upload', url, file };
      });
    } catch {
      for (const url of created) { URL.revokeObjectURL(url); uploads.current.delete(url); }
      throw new Error('تعذر تجهيز الصور. يرجى اختيارها مجدداً.');
    }
  }
  function saveProduct(draft, id = null) {
    const previous = current.current;
    const result = saveDemoProduct(previous.products, draft, id, new Date(), previous.categories);
    commit({ ...previous, products: result.products }); return result;
  }
  function saveFullProduct(draft) {
    const previous = current.current;
    const result = saveFullDemoProduct(previous.products, draft, previous.categories);
    commit({ ...previous, products: result.products }); return result;
  }
  function releaseUnusedImages(images) {
    const used = new Set([
      ...current.current.products.flatMap(product => product.images.filter(image => image.kind === 'upload').map(image => image.url)),
      ...current.current.categories.filter(category => category.image.kind === 'upload').map(category => category.image.url),
    ]);
    for (const image of images) if (image.kind === 'upload' && uploads.current.has(image.url) && !used.has(image.url)) { URL.revokeObjectURL(image.url); uploads.current.delete(image.url); }
  }
  function deleteProduct(id) { commit({ ...current.current, products: deleteDemoProduct(current.current.products, id) }); }
  function saveCategory(draft, id = null) {
    const result = saveDemoCategory(current.current.categories, draft, id);
    commit({ ...current.current, categories: result.categories }); return result;
  }
  function deleteCategory(id, replacementId = null) {
    const result = deleteDemoCategory(current.current.categories, current.current.products, id, replacementId);
    commit(result); return result;
  }
  return <AdminCatalogContext.Provider value={{ ...catalog, categoryOptions: productCategoryOptions(catalog.categories), saveProduct, saveFullProduct, deleteProduct, saveCategory, deleteCategory, uploadImages, discardUnusedUploads, releaseUnusedImages }}>{children}</AdminCatalogContext.Provider>;
}

export function useAdminCatalog() {
  const value = useContext(AdminCatalogContext);
  if (!value) throw new Error('Admin catalogue provider is required');
  return value;
}
