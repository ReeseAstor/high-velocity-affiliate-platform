"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { Plus, Loader2, PackageX } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface Product {
    id: string;
    name: string;
    description: string | null;
    affiliate_url: string;
    commission_rate: number;
    status: string;
    created_at: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formName, setFormName] = useState("");
    const [formUrl, setFormUrl] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formCommission, setFormCommission] = useState("");

    // Fetch products from backend
    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAPI("/products/");
            setProducts(data);
        } catch (err: any) {
            setError(err.message || "Failed to load products");
            console.error("Error loading products:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateProduct(e: React.FormEvent) {
        e.preventDefault();
        if (!formName || !formUrl) return;

        try {
            setSaving(true);
            const newProduct = await fetchAPI("/products/", {
                method: "POST",
                body: JSON.stringify({
                    name: formName,
                    affiliate_url: formUrl,
                    description: formDesc || null,
                    commission_rate: formCommission ? parseFloat(formCommission) : 0,
                }),
            });
            setProducts((prev) => [newProduct, ...prev]);
            setIsModalOpen(false);
            setFormName("");
            setFormUrl("");
            setFormDesc("");
            setFormCommission("");
        } catch (err: any) {
            alert("Failed to create product: " + err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                     <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        Product Catalog
                    </h1>
                    <p className="text-slate-500 mt-2">Manage your affiliate products and generate content.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="text-sm font-medium">Loading products...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    <button
                        onClick={loadProducts}
                        className="mt-3 text-sm text-red-500 hover:text-red-700 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <PackageX className="w-16 h-16 mb-4 opacity-30" />
                    <p className="text-lg font-medium">No products yet</p>
                    <p className="text-sm mt-1">Click &quot;Add Product&quot; to create your first one.</p>
                </div>
            )}

            {/* Product Grid */}
            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            name={product.name}
                            description={product.description || "No description"}
                            affiliateLink={product.affiliate_url}
                            commission={product.commission_rate}
                            status={product.status}
                        />
                    ))}
                </div>
            )}

            {/* Create Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold mb-6">Add New Product</h2>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Product Name *</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="e.g. Awesome Gadget"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Affiliate URL *</label>
                                <input
                                    type="url"
                                    value={formUrl}
                                    onChange={(e) => setFormUrl(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Commission Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formCommission}
                                    onChange={(e) => setFormCommission(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="e.g. 15"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Description</label>
                                <textarea
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                    rows={3}
                                    placeholder="Short description..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {saving ? "Saving..." : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
