import React, { useMemo, useState } from "react";
import API from "../api";
import { ImageIcon, Plus, Trash2 } from "lucide-react";

const categories = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Desktops",
  "Accessories",
  "Audio",
  "Gaming",
  "TVs",
  "Cameras",
  "Wearables",
];

const conditions = ["new", "used", "refurbished"];

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    condition: "new",
    description: "",
  });
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const isValid = useMemo(() => form.name && form.category && form.price, [form]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function onFiles(e) {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    const urls = list.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  function updateSpec(i, field, value) {
    setSpecs((arr) => arr.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  function addSpec() {
    setSpecs((arr) => [...arr, { key: "", value: "" }]);
  }

  function removeSpec(i) {
    setSpecs((arr) => arr.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    try {
      let images = [];
      if (files.length) {
        const data = new FormData();
        files.forEach((f) => data.append("images", f));
        const up = await API.post("/upload/multiple", data, { headers: { "Content-Type": "multipart/form-data" } });
        images = (up.data.urls || []).map((u) => ({ url: u.url }));
      }
      const payload = {
        name: form.name,
        category: form.category,
        brand: form.brand,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        condition: form.condition,
        description: form.description,
        images,
        specs: specs.filter((s) => s.key && s.value),
      };
      const res = await API.post("/products", payload);
      setForm({ name: "", category: "", brand: "", price: "", stock: "", condition: "new", description: "" });
      setSpecs([{ key: "", value: "" }]);
      setFiles([]);
      setPreviews([]);
      alert("Product created: " + res.data.name);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Add Product</h1>
          <p className="text-sm text-gray-500">Create a new electronic product with images and specifications.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="iPhone 15 Pro" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select name="category" value={form.category} onChange={onChange} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10">
                    <option value="">Select</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Brand</label>
                  <input name="brand" value={form.brand} onChange={onChange} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="Apple" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Price</label>
                    <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="999" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Stock</label>
                    <input name="stock" type="number" value={form.stock} onChange={onChange} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="10" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium">Condition</label>
                  <select name="condition" value={form.condition} onChange={onChange} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10">
                    {conditions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea name="description" value={form.description} onChange={onChange} rows={4} className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="Describe the product" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Specifications</h2>
                <button type="button" onClick={addSpec} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"><Plus size={16} /> Add</button>
              </div>
              <div className="space-y-3">
                {specs.map((s, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <input value={s.key} onChange={(e) => updateSpec(i, "key", e.target.value)} placeholder="Key" className="sm:col-span-2 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
                    <input value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Value" className="sm:col-span-3 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
                    <button type="button" onClick={() => removeSpec(i)} className="justify-self-start sm:justify-self-end text-red-600 hover:text-red-700"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h2 className="font-medium mb-4">Images</h2>
              <label className="block">
                <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 cursor-pointer">
                  <ImageIcon className="mb-2" />
                  <span className="text-sm">Click to upload or drag and drop</span>
                  <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
                </div>
              </label>
              {!!previews.length && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {previews.map((src, i) => (
                    <img key={i} src={src} alt="preview" className="h-24 w-full object-cover rounded-lg border" />
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 lg:static bg-white lg:bg-transparent p-4 lg:p-0 shadow lg:shadow-none rounded-xl">
              <button type="submit" disabled={!isValid || submitting} className="w-full inline-flex items-center justify-center rounded-lg bg-black text-white px-4 py-3 font-medium hover:bg-black/90 disabled:opacity-50">
                {submitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
